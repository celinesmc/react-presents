import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { backendURL } from "../Globals";

import { Table, Button } from 'antd';

let SearchPresentComponent = (props) => {
    let [presents, setPresents] = useState([]);
    let navigate = useNavigate();
    let param = useParams();
    let userEmail = param.userEmail;

    let { createNotification } = props

    useEffect( () => {
        getPresents();
    }, [])

    let getPresents = async () => {
        let response = await fetch(backendURL+"/presents?userEmail="+userEmail+"&apiKey="
        +localStorage.getItem("apiKey"))

        if (response.status == 401){
            navigate("/login")
            return
        }

        if (response.ok){
            let jsonData = await response.json();
            setPresents(jsonData)
        } else {
            let jsonData = await response.json();
            navigate("/myPresents")
            createNotification(jsonData.error)
        }
    }

    let choosePresent = async (id) => {
        navigate("/presents/choose/"+id)
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
            title: "Choose",
            dataIndex: "chosenBy",
            render: 
            (_, record) => <Button onClick={() => choosePresent(record.id)}>Choose</Button>
        },
        {
            title: "Choosen?",
                dataIndex: "chosenBy",
                render: (chosenBy) => chosenBy ? "Already chosen" : "Not chosen yet"
        }
    ]
    // Record es la fila actual de la tabla. El primer parámetro representa el valor de la celda correspondiente
    // a esa columna. No lo utilizo, así que le pongo el _

    return (
        <Table columns={columns} dataSource={presents}></Table>
    )

}

export default SearchPresentComponent