import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { backendURL } from "../Globals";

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
            render: (id) => <button  onClick={() => {deletePresent(id)}}>Delete</button>
        },
        {
            title: "Edit",
            dataIndex: "id",
            render: (id) => <button  onClick={() => {editPresent(id)}}>Edit</button>
        }
    ]

    return (
        <div className="container-presents">
            <table className="information-table">
                <thead>
                    <tr>
                        <th>My ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>URL</th>
                        <th>Price</th>
                        <th>Chosen by</th>
                        <th>Delete</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {presents.map((p) => (
                        <tr>
                            <td>{p?.id}</td>
                            <td>{p?.name}</td>
                            <td>{p?.description}</td>
                            <td>{p?.url}</td>
                            <td>{p?.price}</td>
                            <td>{p.chosenBy ? p.chosenBy : "Not chosen yet"}</td>
                            <td><button className="danger-button" onClick={() => {deletePresent(p?.id)}}>Delete</button></td>
                            <td><button className="normal-button" onClick={() => {editPresent(p?.id)}}>Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="form-search-container">
                    { message != "" && <p className="form-message" type="error" message={message}/>}
                    <form className="form">
                    <h2 className="form-title">Search user presents</h2>
                        <input className="input-form" type="text" placeholder="user email" onChange={changeEmail}></input>
                        <button type="primary" 
                        className="normal-button"
                        onClick={searchPresents} 
                        block>Search presents</button>
                    </form>
            </div>
        </div>
    )
}

export default MyPresentsComponent;