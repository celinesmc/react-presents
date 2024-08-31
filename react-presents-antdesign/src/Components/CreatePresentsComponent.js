import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { backendURL } from "../Globals";

import { GiftOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Input, Row, Typography } from "antd";
let { Text } = Typography

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
        <Row align="middle" justify="center" style={{minHeight:"70vh"}}>
        <Col>
        { message != "" && <Alert type="error" message={message} />}
        <Card title="Create present" style={{width: "500px"}}>
            <Input size="large" type="text" placeholder="name" onChange={(e) => changeProperty("name", e)}></Input>
            { error.name && <Text type="danger">{error.name}</Text>}
            <Input size="large" style={{marginTop:"10px"}} type="text" placeholder="description" onChange={(e) => changeProperty("description", e)}></Input>
            { error.description && <Text type="danger">{error.description}</Text>}
            <Input size="large" style={{marginTop:"10px"}} type="number" placeholder="price" onChange={(e) => changeProperty("price", e)}></Input>
            { error.price && <Text type="danger">{error.price}</Text>}
            <Input size="large" style={{marginTop:"10px"}} type="text" placeholder="url" onChange={(e) => changeProperty("url",e)}></Input>
            { error.url && <Text type="danger">{error.url}</Text>}
            <Button type="primary"  
            style={{marginTop:"10px"}} 
            icon={<GiftOutlined/>}
            onClick={clickCreate} block>Create present</Button>
        </Card>
        </Col>
     </Row>
    )
}

export default CreatePresentsComponent;