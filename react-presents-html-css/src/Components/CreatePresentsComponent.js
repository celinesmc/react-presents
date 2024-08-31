import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { backendURL } from "../Globals";

let CreatePresentsComponent = (props) => {
    let [message, setMessage] = useState("")
    let [error, setError] = useState("")
    let [present, setPresent] = useState({})
    let { createNotification } = props
    let navigate = useNavigate();

    useEffect(() => {
        checkInputErrors();
    },[present])

    let checkInputErrors = () => {
        let updatedErrors = {}

        if (present.name == "" || present.name?.length < 3){
            updatedErrors.name = "Too short name"
        }
        if (present.description == "" || present.description?.length < 3){
            updatedErrors.description = "Too short description"
        }
        if (present.price == "" || present.price < 0){
            updatedErrors.price = "Must 0 or positive"
        }
        if (present.url == "" || present.url?.length < 3){
            updatedErrors.url = "Too short url"
        }

        setError(updatedErrors)
    }

    let changeProperty = (propertyName, e) => {
        let presentNew = {...present, [propertyName] : e.currentTarget.value} 
        setPresent(presentNew)
    }


    let clickCreate = async () => {
        checkInputErrors();

        if (Object.keys(error).length > 0) {
            setMessage("Please fix the errors before submitting.");
            return;
        }

        let response = await fetch(backendURL+"/presents?apiKey="+localStorage.getItem("apiKey"), {
            method: "POST",
            headers: { "Content-Type" : "application/json"},
            body: JSON.stringify(present)
        })

        if (response.ok){
            createNotification("Present created")
            navigate("/myPresents");
        } else {
            let jsonData = await response.json();
            setMessage(jsonData.error)
        }
    }

    return (
        <div className="form-container">
        { message != "" && <p className="form-message" type="error" message={message} />}
        <div className="form">
            <h2 className="form-title">Create present</h2>
            <input className="input-form" placeholder="name" onChange={(e) => changeProperty("name", e)}></input>
            { error.name && <p className="form-message">{error.name}</p>}
            <input className="input-form" type="text" placeholder="description" onChange={(e) => changeProperty("description", e)}></input>
            { error.description && <p className="form-message">{error.description}</p>}
            <input className="input-form" type="number" placeholder="price" onChange={(e) => changeProperty("price", e)}></input>
            { error.price && <p className="form-message">{error.price}</p>}
            <input className="input-form" type="text" placeholder="url" onChange={(e) => changeProperty("url",e)}></input>
            { error.url && <p className="form-message">{error.url}</p>}
            <button className="normal-button"
            onClick={clickCreate} block>Create present</button>
        </div>
        </div>
    )
}

export default CreatePresentsComponent;