import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { backendURL } from "../Globals";


let SearchPresentComponent = (props) => {
    let [presents, setPresents] = useState([]);
    let navigate = useNavigate();
    let param = useParams();
    let userEmail = param.userEmail;

    let { createNotification } = props;

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
                    <th>Choose</th>
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
                        <td>{p.chosenBy ?  "Already chosen" : "Not chosen yet"}</td>
                        <td><button className="normal-button" onClick={() => {choosePresent(p?.id)}}>
                        <span class="material-symbols-outlined">check</span>Choose</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}

export default SearchPresentComponent