import React from "react";

function Header(props) {
    return (
        <header>
            <div className="collapse bg-dark" id="navbarHeader">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8 col-md-7 py-4">
                            <h4 className="text-white">About</h4>
                            <p className="text-muted">
                                {props.about}
                            </p>
                        </div>
                        <div className="col-sm-4 offset-md-1 py-4">
                            <h4 className="text-white">Contact</h4>
                            <ul className="list-unstyled">
                                <li>
                                    <a href="https://twitter.com/mrblog" className="text-white"
                                    >Follow on Twitter</a
                                    >
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="navbar navbar-dark bg-dark shadow-sm">
                <div className="container d-flex justify-content-between">
                    <a
                        href="/"
                        className="navbar-brand d-flex align-items-center"
                        id="home-button"
                    >
                        <strong>{props.title}</strong>
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarHeader"
                        aria-controls="navbarHeader"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;