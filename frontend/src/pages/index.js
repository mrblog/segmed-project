import React, { useState } from "react"
import Header from "../components/Header"
import Jumbotron from "../components/Jumbotron"
import photos from "../json/photos.json"
import Photos from "../components/Photos";


// markup
const IndexPage = () => {

  const [state, setState] = useState({
    tags: {},
  })

  const tagPhoto = (photoId) => {
    const tags = state.tags
    const oldState = typeof  tags[photoId] !== "undefined" && tags[photoId]

    console.log("tagPhoto: " + photoId + " " + oldState ? "tagged" : "not tagged")
    tags[photoId] = !oldState
    setState({
      ...state,
      tags: tags
    });
  }


  const title = "Segmed Photo Tagging Project"
  const about = "The task is to build a simple web-app. The webapp should display images as its main feature."+
      "Think of a simple gallery or a list view. Within the same list view, we'd like to have a"+
  "flag\" or \"tag\" button. This button will cause this image to be \"remembered\" in a DB."+
      "In other words: if I reload the page again, I'd like this image to remain flagged/tagged."
  return (<React.Fragment>
    <Header title="Photo Tagging" about={about}/>
    <Jumbotron title={title}>
      Use this app to tag images of interest
    </Jumbotron>
        <Photos photos={photos} tagPhoto={tagPhoto} tags={state.tags} />
  </React.Fragment>
  )
}

export default IndexPage
