import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { backendURL } from "../Globals";

import { Table, Button } from 'antd';

let FriendsListComponent = () => {
    let [friends, setFriends] = useState([]);
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
    

    let columns = [
        {
            title: "Email main user",
            dataIndex: "emailMainUser"
        },
        {
            title: "Email friend",
            dataIndex: "emailFriend"
        },      
    ]

    return (
        <>
        <Table columns={columns} dataSource={friends}/>
        <Button onClick={addFriend}>Add new friend</Button>
        </>
    )


}

export default FriendsListComponent;