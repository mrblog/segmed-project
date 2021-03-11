import React from "react";
import "../css/styles.css"

function photoMarkup(photo, tags, tagAction) {

    const isTagged = typeof  tags[photo.id] !== "undefined" && tags[photo.id]
    console.log("Photo "+ photo.id + " " + (isTagged ? "tagged" : "not tagged"))
    return (
        <div key={photo.id} className="col-md-4">
            <div className={"card mb-4 shadow-sm " + (isTagged ? "tagged" : "")}>
                <img
                    className="card-img-top"
                    src={photo.url}
                    alt={photo.title}
                />
                <div className="card-body">
                    <h5 className="card-title">{photo.title}</h5>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                            <button
                                type="button"
                                className={"btn btn-sm shadow-none photoView " +  (isTagged ? "btn-outline-danger" : "btn-outline-secondary")}
                                onClick={(e) => {
                                    e.preventDefault()
                                    tagAction(photo.id);
                                }}
                            >
                                {isTagged ? "Remove Tag" : "Tag Photo"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Photos(props) {
    var photosList = [];
    for (var i in props.photos) {
        photosList.push(photoMarkup(props.photos[i], props.tags, props.tagPhoto));
    }
    return (
        <div className="album py-5 bg-light">
            <div className="container">
                <div className="row" id="photos">
                    {photosList}
                </div>
            </div>
        </div>
    );
}

export default Photos;