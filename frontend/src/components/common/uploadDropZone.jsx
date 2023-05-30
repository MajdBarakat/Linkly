import React, {useEffect, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import { DesktopComputerIcon } from "@heroicons/react/outline";
import http from '../services/httpService';
import getUser from "../services/getUser";

function UploadDropZone({ dir, link }) {
  const [files, setFiles] = useState([]);
  const [dropped, setDropped] = useState(false);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': []
    },
    multiple: false,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      setDropped(true);
    }
  });

  const assignName = async (file, userId) => {
    let name = userId
    if (dir !== "profile") {
      name += "_"+link.id
    }
    const newFile = new File([file], name+".png", {type: 'image/png'});
    return newFile
  }
  
  const doSubmit = async (file) => {
    const jwt = localStorage.getItem('jwt')
    const user = await getUser(jwt);
    file = await assignName(file, user._id);

    const formData = new FormData();
    formData.append("file", file);

    const result = await http
      .post(process.env.REACT_APP_API + `/image/upload/${dir}`, formData)
      .catch((err) => alert(err.response.data));
    if (!result) return

    console.log(result)

    if (dir === "profile") {
      const result2 = await http
        .put(process.env.REACT_APP_API + "/users/update",
          {
            appearance: {
              profile: {
                profilePicURL: result.data + "?" + new Date().toISOString()
              }
            }
          },
          { headers: { "x-auth-token": jwt } }
        )
        .catch((err) => alert(err.response.data));
      if (!result2) return;
    }
    else if (dir === "thumbnail" || dir === "banner") {
      delete link.isEditing;
      link[dir + "URL"] = result.data + "?" + new Date().toISOString();

      const result3 = await http
        .put(process.env.REACT_APP_API + "/links/edit", link,
          { headers: { "x-auth-token": jwt } }
        )
        .catch((err) => alert(err.response.data));
      if (!result3) return;
    }

    console.log("Profile updated!")
    window.location.reload(false);
  }

  let preview;
  if (files.length === 0) {
    preview =
      <div className='err-container'>
        <h3>Invalid file format. Only files with the following extensions are allowed: .png .jpg .jpeg</h3>
        <button className="secondary-btn" onClick={()=>setDropped(false)}>Dismiss</button>
      </div>
  }
  else {
    preview = files.map(file => (
      <section className='dropped-container' key={file.name}>
        <div className='dropped-file'>
          <div className='preview' style={{backgroundImage: `url(${file.preview})`}}>
              <img
              src={file.preview}
              />
          </div>
        </div>
        <button className='secondary-btn' onClick={() => doSubmit(file)}>Save and Upload Image</button>
      </section>
    ));
  }


  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  if (dropped) {
    return (
      preview
    );
  }
  else {
    return (
      <section className={"dropzone-container" + (isDragActive ? " hovered" : "")}>
          <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} />
            <img className="profile-pic" src="https://linkly-content.s3.eu-west-2.amazonaws.com/profile/default.png" />
            <h1>Drag photo here</h1>
            <h1>or</h1>
            <button className='secondary-btn'> <DesktopComputerIcon/> Upload from computer</button>
          </div>
        </section>
    );
  }
}

export default UploadDropZone