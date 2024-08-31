import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { backendURL } from "../Globals";

import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Table, Button, Row, Col, Alert, Card, Input } from 'antd';

let MyPresentsComponent = (props) => {
    let [presents, setPresents] = useState([]);
    let [message, setMessage] = useState("")
    let [email, setEmail] = useState("")
    let navigate = useNavigate();

    let { createNotification } = props

    useEffect( () => {
        getPresents();
    }, [])

    let getPresents = async () => {
        let response = await fetch(backendURL+"/presents?userEmail="+localStorage.getItem("email")+"&apiKey="
        +localStorage.getItem("apiKey"))

        if (response.status == 401){
            navigate("/login")
            return
        }

        if (response.ok){
            let jsonData = await response.json();
            setPresents(jsonData)
        } else {
            setMessage("Error")
        }
    }

    
    let deletePresent = async (id) => {
        let response = await fetch(backendURL+"/presents/"+id+"?apiKey="+localStorage.getItem("apiKey")
        +"&idUser="+localStorage.getItem("userId"), {
            method: "DELETE"
        })
        if (response.ok){
           let updatedPresents = presents.filter(present => present != id) 
           createNotification("Item deleted successfuly")
           setPresents(updatedPresents)
        }else{
            let jsonData = await response.json();
            setMessage(jsonData.error); 
        }
    }

    let editPresent = (id) => {
        navigate("/presents/edit/"+id) 
    }

    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)
    }

    let searchPresents = async () => {
        if (email != null) {
            navigate("/presents/search/"+email)
        } else {
            setMessage("email can't be empty")
        }
    }

    let columns = [
        {
            title: "Mi id",
            dataIndex: "id" 
        },
        {
            title: "name",
            dataIndex: "name"
        },
        {
            title: "Description",
            dataIndex: "description"
        },
        {
            title: "URL",
            dataIndex: "url"
        },
        {
            title: "Price",
            dataIndex: "price"
        },
        {
            title: "Chosen by",
            dataIndex: "chosenBy",
            render: (chosenBy) => chosenBy ? chosenBy : "Not chosen yet"
        },
        {
            title: "Delete",
            dataIndex: "id",
            render: (id) => <Button danger icon={<DeleteOutlined/>} onClick={() => {deletePresent(id)}}>Delete</Button>
        },
        {
            title: "Edit",
            dataIndex: "id",
            render: (id) => <Button type="primary" icon={<EditOutlined/>} onClick={() => {editPresent(id)}}>Edit</Button>
        }
    ]

    return (
        <>
            <Table columns={columns} dataSource={presents}></Table>
            <Row align="center" justify="center" style={{minHeight:"30vh"}}>
                <Col>
                    { message != "" && <Alert type="error" message={message}/>}
                    <Card title="Search user presents" style={{width: "500px"}}>
                        <Input size="large" type="text" placeholder="user email" onChange={changeEmail}></Input>
                        <Button type="primary" 
                        style={{marginTop:"10px"}} 
                        onClick={searchPresents} 
                        icon={<SearchOutlined/>}
                        block>Search presents</Button>
                    </Card>
                </Col>
            </Row>
        </>
    )


}

export default MyPresentsComponent;