import { useState, useEffect } from "react";
import { backendURL } from "../Globals"
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Input, Row, Typography } from "antd";

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

    let { Text } = Typography

    return (
        <Row align="middle" justify="center" style={{minHeight:"70vh"}}>
            <Col>
            { message != "" && <Alert type="error" message={message} />}
            <Card title="Create user" style={{width: "500px"}}>
                <Input size="large" type="text" placeholder="your email" onChange={changeEmail}></Input>
                { error.email && <Text type="danger">{error.email}</Text>}
                <Input size="large" style={{marginTop:"10px"}} type="text" placeholder="your name" onChange={changeName}></Input>
                { error.name && <Text type="danger">{error.name}</Text>}
                <Input size="large" style={{marginTop:"10px"}} type="password" placeholder="your password" onChange={changePassword}></Input>
                { error.password && <Text type="danger">{error.password}</Text>}
                <Button type="primary" style={{marginTop:"10px"}} onClick={clickCreate} block>Create Account</Button>
            </Card>
            </Col>
    </Row>
    )
}


export default CreateUserComponent;