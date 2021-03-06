import React from "react"
import Header from "../components/Header"
import Jumbotron from "../components/Jumbotron"
import Photos from "../components/Photos"
import Login from "../components/Login"
import { getAuthToken, handleLogin, isLoggedIn, logout } from "../services/auth"
import StatusMessage from "../components/StatusMessage";

import "../css/styles.css"

const api = require("../services/tagapi")


// markup
class IndexPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tags: {},
      photos: [],
      username: "",
      statusMessage: null,
      statusClass: null
    }
    this.title = "Segmed Photo Tagging Project"
    this.about = "The task is to build a simple web-app. The webapp should display images as its main feature." +
        " Think of a simple gallery or a list view. Within the same list view, we'd like to have a" +
        " \"flag\" or \"tag\" button. This button will cause this image to be \"remembered\" in a DB." +
        " In other words: if I reload the page again, I'd like this image to remain flagged/tagged."
  }

  componentDidMount() {
    if (isLoggedIn()) {
      this.loadPhotos()
    }

  }

  errMessage = (msg, style) => {
    this.setState({
      statusMessage: msg,
      statusClass: style
    })
  }

  loadPhotos = () => {
    api.getPhotos(getAuthToken()).then(photos => {
      this.setState({
        photos: photos,
        statusMessage: null,
        statusClass: null
      })
      this.loadTags()
    }).catch(err => {
      this.setState({
        statusMessage: err.message,
        statusClass: "danger"
      })
    })
  }

  loadTags = () => {
    api.getTags(getAuthToken()).then(tags => {
      const tagData = {}
      tags.forEach(tag => {
        tagData[tag.photoId] = tag.tag
      })
      this.setState({
        tags: tagData
      })
    }).catch(err => {
      this.setState({
        statusMessage: err.message,
        statusClass: "danger"
      })
    })
  }


  tagPhoto = (photoId) => {

    const oldState = typeof  this.state.tags[photoId] !== "undefined" && this.state.tags[photoId]

    console.log("tagPhoto: " + photoId + " " + oldState ? "tagged" : "not tagged")
    api.postTag(getAuthToken(), photoId, !oldState).then(() => {
      this.loadTags()
    }).catch(err => {
      this.setState({
        statusMessage: err.message,
        statusClass: "danger"
      })
    })
  }

  logoutAction = (e) => {
    e.preventDefault()
    logout(() => {
      this.setState({
        tags: {},
        photos: [],
        username: "",
        statusMessage: null,
        statusClass: null
      })
    })
  }

  loginUser = (username) => {
    handleLogin(username).then(() => {
      this.setState({
        statusMessage: "signed in, loading photos...",
        statusClass: "success"
      })
      this.loadPhotos()
    }).catch(err => {
      this.setState({
        statusMessage: err.message,
        statusClass: "danger"
      })
    })
  }

  render() {

    let mainBody
    if (isLoggedIn()) {
      mainBody = <Photos photos={this.state.photos} tagPhoto={this.tagPhoto} tags={this.state.tags}/>
    } else {
      mainBody = <Login errMessage={this.errMessage} loginAction={this.loginUser} />
    }
    return (<React.Fragment>
          <Header title="Photo Tagging" about={this.about} logout={this.logoutAction} isLoggedIn={isLoggedIn()} />
          <Jumbotron title={this.title}>
            Use this app to tag images of interest
          </Jumbotron>
          <StatusMessage message={this.state.statusMessage} color={this.state.statusClass}/>
          {mainBody}
        </React.Fragment>
    )
  }
}

export default IndexPage
