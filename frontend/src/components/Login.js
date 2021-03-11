import React from "react";
import "../css/styles.css"

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            username: ""
        }
    }

    isAlphaNumeric(str) {
        var code, i, len;

        for (i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
                return false;
            }
        }
        return true;
    };

    render() {
       return  <div className="login">
            <form onSubmit={(e) => {
                e.preventDefault()
                if (!this.isAlphaNumeric(this.state.username)) {
                    this.props.errMessage("username must be letters and numbers only", "warning")
                } else {
                    this.props.loginAction(this.state.username)
                }
            }}>
                <div className="form-group">
                    <label htmlFor="inputUsername">Username</label>
                    <input type="username" className="form-control" id="inputUsername" aria-describedby="usernameHelp"
                           placeholder="Choose username" required onChange={(e) => {
                        this.setState({
                            username: e.target.value
                        })
                    }} value={this.state.username}/>
                    <small id="usernameHelp" className="form-text text-muted">
                        Use any alphanumeric username
                    </small>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    }
}
export default Login