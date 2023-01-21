import React from "react";
import Joi from "joi-browser";
import http from "../services/httpService";
import getUser from "../services/getUser";
import config from "../../config.json";
import Form from "./form";
import Upload from "./upload";
import Preview from "./preview";
import ColorPicker from "./colorPicker";

class Appearance extends Form {
  state = {
    data: {
      isVerified: false,
      profilePicURL: "",
      profilePicShape: 0,
      name: "",
      title: "",
      bio: "",
      layoutId: 0,
      linkLayout: 0,
      isUsingTheme: true,
      themeId: 0,
      bgdPrimaryColor: "",
      bgdSecondaryColor: "",
      fontColor: "",
      linksColor: "",
      isUsingBackgroundImage: false,
      backgroundImageURL: "",
      backgroundId: 0,
      fontId: 0,
    },
    errors: {},
    loaded: false,
    fetchedData: {},
    isUploading: false,
    pickingColor: false,
    colorName: "",
    preview: "Mobile",
  };
  
  jwt = localStorage.getItem('jwt')

  async componentDidMount() {
    const result = await getUser(this.jwt) 
    if (result) {
      const data = { ...this.state.data };
      const { profile, layout, theme, custom } = result.appearance;
      const { colors, background } = custom;
      data.isVerified = result.isVerified;
      data.profilePicURL = profile.profilePicURL;
      data.profilePicShape = profile.profilePicShape;
      data.name = profile.name;
      data.title = profile.title;
      data.bio = profile.bio;
      data.layoutId = layout.layoutId;
      data.linkLayout = layout.linkLayout;
      data.isUsingTheme = theme.isUsingTheme;
      data.themeId = theme.themeId;
      data.bgdPrimaryColor = colors.bgdPrimary;
      data.bgdSecondaryColor = colors.bgdSecondary;
      data.fontColor = colors.font;
      data.linksColor = colors.links;
      data.isUsingBackgroundImage = background.isUsingBackgroundImage;
      data.backgroundImageURL = background.backgroundImageURL;
      data.backgroundId = background.backgroundId;
      data.fontId = custom.fontId;
      this.setState({ data, loaded: true, fetchedData: data });
    }
  }

  schema = {
    isVerified: Joi.boolean(),
    profilePicURL: Joi.string().min(5).max(255).label("Profile Pic"),
    profilePicShape: Joi.number().label("Profile Shape"),
    name: Joi.string().allow("").max(30).label("Name"),
    title: Joi.string().allow("").max(30).label("Title"),
    bio: Joi.string().allow("").max(80).label("Bio"),
    layoutId: Joi.number().label("Layout ID"),
    linkLayout: Joi.number().label("Link Layout"),
    isUsingTheme: Joi.boolean().label("Using Theme"),
    themeId: Joi.number().label("Theme ID"),
    bgdPrimaryColor: Joi.string().label("Bgd Primary"),
    bgdSecondaryColor: Joi.string().label("Bgd Secondary"),
    fontColor: Joi.string().label("Font Color"),
    linksColor: Joi.string().label("Links Color"),
    isUsingBackgroundImage: Joi.boolean().label("Using Bgd Image"),
    backgroundImageURL: Joi.string().label("Bgd Image URL"),
    backgroundId: Joi.number().label("Bgd ID"),
    fontId: Joi.number().label("Font ID"),
  };

  doSubmit = async () => {
    const { data } = this.state;
    const result = await http
      .put(
        config.api + "/users/update",
        {
          appearance: {
            profile: {
              profilePicURL: data.profilePicURL,
              profilePicShape: data.profilePicShape,
              name: data.name,
              title: data.title,
              bio: data.bio,
            },
            layout: {
              layoutId: data.layoutId,
              linkLayout: data.linkLayout,
            },
            theme: {
              isUsingTheme: data.isUsingTheme,
              themeId: data.themeId,
            },
            custom: {
              colors: {
                bgdPrimary: data.bgdPrimaryColor,
                bgdSecondary: data.bgdSecondaryColor,
                font: data.fontColor,
                links: data.linksColor,
              },
              background: {
                isUsingBackgroundImage: data.isUsingBackgroundImage,
                backgroundImageURL: data.backgroundImageURL,
                backgroundId: data.backgroundId
              },
              fontId: data.fontId,
            },
          },
        },
        { headers: { "x-auth-token": this.jwt } }
      )
      .catch((err) => alert(err.response.data));

    if (!result) return;

    console.log("Profile updated successfully!");
    this.setState({ fetchedData: this.state.data });
  };

  handleSelect = async (fields) => {
    const data = { ...this.state.data }
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].name !== "themeId" && fields[i].name !== "isUsingTheme") {
        data.themeId = 0
        data.isUsingTheme = false
      }
      data[fields[i].name] = fields[i].value
    }
    this.setState({ data }, () => this.doSubmit())
  }

  renderSelectItem = (name, index, selected, fields) => {
    return (
      <div key={index} className={selected ? "selected" : undefined} onClick={() => this.handleSelect(fields)}>{name}</div>
    )
  }

  renderColorItems = () => {
    const colors = ["bgdPrimaryColor", "bgdSecondaryColor", "fontColor", "linksColor"]
    const { data } = this.state
    return (
      config.colors.map((name, index) => (
        <div onClick={() => this.setState({ pickingColor: colors[index], colorName: name }) }>
        <div style={{color: this.state.data[colors[index]]}}>CLICK HERE TO SELECT COLOR</div>
        <div>
          <h2>{name}</h2>
          <h3>{this.state.data[colors[index]]}</h3>
        </div>
      </div>
    ))) 
  }

  render() {
    const valuesChanged = !(
      JSON.stringify(this.state.data) === JSON.stringify(this.state.fetchedData)
    );
    const { data, pickingColor, isUploading } = this.state;
    if (!this.state.loaded) return <h1>Loading...</h1>;
    else {
      return (
        <React.Fragment>
          <div className="split">
            <div className="middle-container appearance">

              {/* PROFILE */}
              <div className="section-title">
                <h2>Profile</h2>
              </div>
              <form className="container appearance-profile" onSubmit={this.handleSubmit}>
                <div className="left">
                  <div
                    className="profile-pic"
                    onClick={() => this.setState({ isUploading: true })}
                    style={{background: `url(${this.state.data.profilePicURL})`}}
                  ></div>
                </div>
                <div className="right">
                  {this.renderInput("name", "Name")}
                  {/* {this.renderInput("title", "Title")} */}
                  {this.renderTextarea("bio", "Bio", "Tell us more about you..")}
                </div>
              </form>

              {/* LAYOUT */}
              <div className="section-title">
                <h2>Layout</h2>
              </div>
              <form className="container appearance-grid layout">
                {config.layouts.map((name, index) => (
                  this.renderSelectItem(name, index, data.layoutId === index, [{ name: "layoutId", value: index }])
                ))}
              </form>

              {/* THEMES */}
              <div className="section-title">
                <h2>Themes</h2>
              </div>
              <form className="container appearance-grid themes">
                {config.themes.map((name, index) => (
                  this.renderSelectItem(name, index, data.themeId === index, [{ name: "themeId", value: index }, { name: "isUsingTheme", value: index > 0 ? true : false }])
                ))}
              </form>

              {/* BACKGROUND */}
              <div className="section-title">
                <h2>Background</h2>
              </div>
              <form className="container appearance-grid backgrounds">
                {config.backgrounds.map((name, index) => (
                  this.renderSelectItem(name, index, data.backgroundId === index, [{ name: "backgroundId", value: index }])
                ))}
              </form>

              {/* COLORS */}
              <div className="section-title">
                <h2>Colors</h2>
              </div>
              <form className="container appearance-grid colors">
                {this.renderColorItems()}
              </form>

              {/* FONT */}
              <div className="section-title">
                <h2>Font</h2>
              </div>
              <form className="container appearance-grid fonts">
                {config.fonts.map((name, index) => (
                  this.renderSelectItem(name, index, data.backgroundId === index, [{ name: "fontId", value: index }])
                ))}
              </form>
            </div>
            {isUploading && (
              <Upload onExit={() => this.setState({ isUploading: false })} dir="profile"/>
            )}
            {pickingColor && (
              <ColorPicker
                color={data[pickingColor]}
                name={this.state.colorName}
                onChangeComplete={(color) => this.handleSelect([{ name: pickingColor, value: color.hex }])}
                onExit={() => this.setState({ pickingColor: false })} />
            )}
            {this.state.preview === "Mobile" && <Preview viewType="Mobile"/>}
          </div>
          {this.state.preview === "Desktop" && <Preview viewType="Desktop"/>}
        </React.Fragment>
      );
    }
  }
}

export default Appearance;
