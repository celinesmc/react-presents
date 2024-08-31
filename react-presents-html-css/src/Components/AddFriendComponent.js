import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { backendURL } from "../Globals"

let AddFriendComponent = (props) => {
    let [email, setEmail] = useState(null);
    let [message, setMessage] = useState("")
    let [error, setError] = useState("")
    let { createNotification } = props

    let navigate = useNavigate();

    useEffect(() => {
        checkInputErrors();
    },[email])

    let checkInputErrors = () => {
        let updatedErrors = {}

        if (email == "" || email != null && /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/.test(email) == false){
            updatedErrors.email = "Incorrect email format"
        }

        setError(updatedErrors)
    }

    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)
    }

    let clickCreate = async () => { 
        let response = await fetch(backendURL+"/friends?apiKey="+localStorage.getItem("apiKey"), {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify ({ 
                emailMainUser: localStorage.getItem("email"),
                emailFriend: email
            })
        })
        if (response.ok){
            let jsonData = await response.json();
            createNotification("Friend added successfully")
            navigate("/friends")
        } else {
            let jsonData = await response.json();
            if (Array.isArray(jsonData.error)){
                let finalErrorMessage = "";
                jsonData.error.forEach(obj => 
                    { finalErrorMessage += obj + " "})
                setMessage(finalErrorMessage)
            } else {
                setMessage(jsonData.error)
            }
        }
    }

    return (
        <div className="form-container">
            { message != "" && <p className="error-message">{message}</p>}
            <div className="form">
                <h2 className="form-title">Add friend</h2>
                    <input className="input-form"  placeholder="friend email" onChange={changeEmail}></input>
                    { error.email && <p className="form-message">{error.email}</p>}
                    <button className="normal-button"
                    onClick={clickCreate} block>Add friend</button>
            </div>
    </div>
    )
}


export default AddFriendComponent;