import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { backendURL } from "../Globals";

import { Table, Button } from 'antd';

let FriendsListComponent = (props) => {
    let { createNotification } = props;
    let [friends, setFriends] = useState([]);
    let [message, setMessage] = useState("");
    let navigate = useNavigate();

    useEffect( () => {
        getFriends();
    }, [])

    let getFriends = async () => {
        let response = await fetch(backendURL+"/friends?apiKey="+localStorage.getItem("apiKey"))

        if (response.ok){
            let jsonData = await response.json();
            setFriends(jsonData)
        } else {
            let jsonData = await response.json();
        }
    }

    let addFriend = async () => {
        navigate("/addFriends")
    }

    let deletePresent = async (emailFriend) => {
        let response = await fetch(backendURL+"/friends/"+emailFriend+"?apiKey="+localStorage.getItem("apiKey"), {
            method: "DELETE"
        })

        if (response.ok){
           let updatedFriends = friends.filter(friends => friends != emailFriend) 
           createNotification("Friend deleted successfuly")
           setFriends(updatedFriends)
        }else{
            let jsonData = await response.json();
            setMessage(jsonData.error); 
        }
    }
    

    let columns = [
        {
            title: "Email main user",
            dataIndex: "emailMainUser"
        },
        {
            title: "Email friend",
            dataIndex: "emailFriend"
        },
        {
            title: "Delete friend",
            dataIndex: "emailFriend",
            render: (emailFriend) => <Button onClick={() => {deletePresent(emailFriend)}}>Delete</Button>
        }      
    ]

    return (
        <>
        <Table columns={columns} dataSource={friends}/>
        <Button onClick={addFriend}>Add new friend</Button>
        </>
    )


}

export default FriendsListComponent;