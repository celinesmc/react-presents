import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { backendURL } from "../Globals"

import { Alert, Button, Card, Col, Input, Row, Typography } from "antd";
let { Text } = Typography;

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
        <Row align="middle" justify="center" style={{minHeight:"70vh"}}>
            <Col>
            { message != "" && <Alert type="error" message={message} />}
            <Card title="Add friend" style={{width: "500px"}}>
                <Input size="large" type="text" placeholder="friend email" onChange={changeEmail}></Input>
                { error.email && <Text type="danger">{error.email}</Text>}
                <Button type="primary" style={{marginTop:"10px"}} onClick={clickCreate} block>Add friend</Button>
            </Card>
            </Col>
    </Row>
    )
}


export default AddFriendComponent;