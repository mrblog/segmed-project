import React from 'react';

function StatusMessage(props) {

    if (props.message) {
        let color = props.color ? props.color : "danger"
        return (
            <div className={`alert alert-${color}`}>
                {props.message}
            </div>
        );
    } else {
        return ""
    }
}

export default StatusMessage;