import React from "react";

function Jumbotron(props) {
    return (
        <section className="jumbotron text-center">
            <div className="container">
                <h1 className="jumbotron-heading">{props.title}</h1>
                <p className="lead text-muted">
                    {props.children}
                </p>
            </div>
        </section>
    );
}

export default Jumbotron;