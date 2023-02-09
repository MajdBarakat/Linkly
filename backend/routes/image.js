const env = require("dotenv").config();
// const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  credentials: {
    secretAccessKey: process.env.accessSecret,
    accessKeyId: process.env.accessKey,
  },
  region: process.env.region,
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true)
  } else {
      cb(null, false)
  }
}

const s3 = new aws.S3();
const bucket = process.env.bucket;

const upload = multer({
  storage: multerS3({
    bucket: bucket,
    s3: s3,
    acl: "public-read",
    fileFilter: fileFilter,
    key: (req, file, callback) => {
      callback(null, `${req.params.dir}/` + file.originalname );
    }, 
  }),
});

router.post("/upload/:dir", upload.single("file"), (req, res) => {
  res.send(req.file.location);
});

router.get("/list", async (req, res) => {
  let result = await s3.listObjectsV2({ Bucket: bucket, Prefix: req.query ? req.query.dir : undefined }).promise();
  let fileNames = result.Contents.map((i) => i.Key);
  res.send(fileNames);
});

router.get("/download/:filename", async (req, res) => {
  const fileName = req.params.filename;
  let result = await s3.getObject({ Bucket: bucket, Key: fileName }).promise();
  res.send(result.Body);
});

router.delete("/delete/:filename", async (req, res) => {
  const filepath = req.body.path + req.params.filename;
  let result = await s3
    .deleteObject({ Bucket: bucket, Key: filepath })
    .promise();
  res.send("file successfully deleted!" + result);
});

module.exports = router;
