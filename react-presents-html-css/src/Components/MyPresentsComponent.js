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

    return (
        <div className="container-presents">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
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
                            <td><button className="danger-button" onClick={() => {deletePresent(p?.id)}}>
                            <span className="material-symbols-outlined">delete</span>Delete</button></td>
                            <td><button className="normal-button" onClick={() => {editPresent(p?.id)}}>
                            <span className="material-symbols-outlined">edit</span>Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="form-search-container">
                { message != "" && <p className="error-message">{message}</p>}
                    <form className="form">
                    <h2 className="form-title">Search user presents</h2>
                        <input className="input-form" type="text" placeholder="user email" onChange={changeEmail}></input>
                        <button type="primary" 
                        className="normal-button"
                        onClick={searchPresents} 
                        block>
                            <span className="material-symbols-outlined">search</span>
                            Search present
                        </button>
                    </form>
            </div>
        </div>
    )
}

export default MyPresentsComponent;