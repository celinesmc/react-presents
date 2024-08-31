import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { backendURL } from "../Globals"

let LoginUserComponent = (props) => {
    let { setLogin } = props
    let [email, setEmail] = useState(null)
    let [password, setPassword] = useState(null)
    let [error, setError] = useState("")
    let [message, setMessage] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        checkInputErrors();
    },[email,password])

    let checkInputErrors = () => {
        let updatedErrors = {}

        if (email == "" || email?.length < 3 || email != null && /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/.test(email) == false){
            updatedErrors.email = "Incorrect email format"
        }
        if (password == "" || password?.length < 5){
            updatedErrors.password = "Too short password"
        }

        setError(updatedErrors)
    }

    let clickLogin = async () => {
        let response = await fetch(backendURL+"/users/login", {
            method: "POST",
            headers: { "Content-Type" : "application/json"},
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        if (response.ok){
            let jsonData = await response.json();
            if (jsonData.apiKey != null){
                localStorage.setItem("apiKey", jsonData.apiKey)
                console.log(localStorage.getItem("apiKey"))
                localStorage.setItem("idUser", jsonData.id)
                localStorage.setItem("email", jsonData.email)
                setLogin(true)
                navigate("/myPresents")
            }
            setMessage("Login succesfully")
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
                    <h2 className="form-title">Login</h2>
                    <input value={email} 
                    className="input-form" 
                    onChange={(e) => setEmail(e.target.value)}
                    type="text" 
                    placeholder="your email"></input>
                    <input value={password} 
                    className="input-form" 
                    type="password" 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="your password"></input>
                    <button className="normal-button"
                    onClick={clickLogin} block>Login</button>
                </div>
        </div>
    )
}

export default LoginUserComponent