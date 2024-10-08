import { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";

import { backendURL } from "../Globals";

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
            createNotification(jsonData.error)
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
    
    return (
        <div className="container-presents">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <table className="information-table">
                <thead>
                    <tr>
                        <th>Email main user</th>
                        <th>Email friend</th>
                        <th>Delete friend</th>
                    </tr>
                </thead>
                <tbody>
                    {friends.map((f) => (
                        <tr>
                            <td>{f?.emailMainUser}</td>
                            <td>{f?.emailFriend}</td>
                            <td><button className="danger-button" onClick={() => {deletePresent(f?.emailFriend)}}>
                            <span className="material-symbols-outlined">delete</span>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>    
            <div className="form-add-container">
                { message != "" && <p className="error-message">{message}</p>}
                <form>
                    <button className="normal-button" onClick={addFriend}>
                        <span class="material-symbols-outlined">person_add</span>Add new friend</button>
                </form>
            </div>
        </div>
    )


}

export default FriendsListComponent;