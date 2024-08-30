import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { backendURL } from "../Globals"

import { Button, Card, Input, Row, Col, Alert} from "antd";

let LoginUserComponent = (props) => {
    let { setLogin } = props
    let email = useRef(null)
    let password = useRef(null)
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
                email: email.current.input.value,
                password: password.current.input.value
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
            setMessage("Login correcto")
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
        <Row align="middle" justify="center" style={{minHeight:"70vh"}}>
            <Col>
            { message != "" && <Alert type="error" message={message} />}
                <Card title="Login" style={{ width: "500px"}}>
                    <Input ref={email} size="large" type="text" placeholder="your email"></Input>
                    <Input ref={password} size="large" style={{marginTop: "10px"}} type="password" placeholder="your password"></Input>
                    <Button type="primary" style={{marginTop: "10px"}} 
                        onClick={clickLogin} block>Login</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default LoginUserComponent