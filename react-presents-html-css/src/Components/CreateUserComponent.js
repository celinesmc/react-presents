import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { backendURL } from "../Globals"

let CreateUserComponent = (props) => {
    let [email, setEmail] = useState(null);
    let [password, setPassword] = useState(null);
    let [name, setName] = useState(null);
    let [message, setMessage] = useState("")
    let [error, setError] = useState("")
    let { createNotification } = props

    let navigate = useNavigate();

    useEffect(() => {
        checkInputErrors();
    },[email,password,name])

    let checkInputErrors = () => {
        let updatedErrors = {}

        if (email == "" || email?.length < 3 || email != null && /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/.test(email) == false){
            updatedErrors.email = "Incorrect email format"
        }
        if (password == "" || password?.length < 5){
            updatedErrors.password = "Too short password"
        }
        if (name == ""){
            updatedErrors.name = "Type a name"
        }

        setError(updatedErrors)
    }

    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)
    }

    let changePassword = (e) => {
        setPassword(e.currentTarget.value)
    }

    let changeName = (e) => {
        setName(e.currentTarget.value)
    }

    let clickCreate = async () => { 
        let response = await fetch(backendURL+"/users", {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify ({ 
                email: email,
                password: password,
                name: name
            })
        })
        if (response.ok){
            let jsonData = await response.json();
            createNotification("User created successfully")
            navigate("/login")
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
                <h2 className="form-title">Register</h2>
                <input className="input-form" type="text" placeholder="your email" onChange={changeEmail}></input>
                { error.email && <p className="form-message">{error.email}</p>}
                <input className="input-form" type="text" placeholder="your name" onChange={changeName}></input>
                { error.name && <p className="form-message">{error.name}</p>}
                <input className="input-form" type="password" placeholder="your password" onChange={changePassword}></input>
                { error.password && <p className="form-message">{error.password}</p>}
                <button className="normal-button"
                onClick={clickCreate} block>Create Account</button>
            </div>
        </div>
    )
}


export default CreateUserComponent;