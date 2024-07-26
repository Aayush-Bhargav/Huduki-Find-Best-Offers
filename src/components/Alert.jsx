import React from 'react'
//component to show an alert that take message and color as props
const Alert = (props) => {
    return (
        <div>
            <div className={`alert alert-${props.alert.color}`} role="alert">
                {props.alert.msg}
            </div>
        </div>
    )
}
export default Alert;