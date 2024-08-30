import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";

import { backendURL } from "../Globals";

import { Card, Input, Button, Row, Col, Alert} from "antd"

let EditPresentComponent = (props) => {
    let { createNotification } = props
    let [presents, setPresents] = useState({});
    let { presentId } = useParams()
    let [message, setMessage] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        getPresent();
    }, [])

    let getPresent = async () => {
        let response = await fetch(backendURL+"/presents/"+presentId+"?apiKey="+localStorage.getItem("apiKey"))

        if (response.ok){
            let jsonData = await response.json();
            setPresents(jsonData[0])
        } else {
            setMessage("Error")
        }
    }

    let clickEdit = async () => {
        let response = await fetch(backendURL+"/presents/"+presentId+"?apiKey="+localStorage.getItem("apiKey"), {
            method: "PUT",
            headers: { "Content-Type" : "application/json"},
            body: JSON.stringify(presents)
        })

        if (response.ok){
            setMessage("Modified")
            createNotification("Present has been edited correctly")
            navigate("/myPresents")
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let changeProperty = (propertyName, value)=> {
        let newPresentValues = {...presents,[propertyName] : value }
        setPresents(newPresentValues)
    }

    return (
        <Row align="middle" justify="center" style={{minHeight:"70vh"}}>
            <Col>
            { message != "" && <Alert type="info" message={message}/>}
                <Card title="Edit present" style={{ width: "500px"}}>
                    <Input 
                        onChange={(e) => changeProperty("name", e.currentTarget.value)}
                        size="large" type="text" 
                        value={presents?.name}
                        placeholder="your name"/>
                    <Input 
                        onChange={(e) => changeProperty("description", e.currentTarget.value)}
                        size="large" type="text" 
                        placeholder="your description"
                        style={{marginTop: "10px"}} 
                        value={presents?.description}/>
                    <Input 
                        onChange={(e) => changeProperty("url", e.currentTarget.value)}
                        size="large" type="text" 
                        placeholder="your url" 
                        style={{marginTop: "10px"}}
                        value={presents?.url}/>
                    <Input 
                        onChange={(e) => changeProperty("price", e.currentTarget.value)}
                        size="large" type="number" 
                        placeholder="your price"
                        style={{marginTop: "10px"}}
                        value={presents?.price}/>
                    <Button type="primary" style={{marginTop: "10px"}} 
                        onClick={clickEdit} block>Edit present</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default EditPresentComponent