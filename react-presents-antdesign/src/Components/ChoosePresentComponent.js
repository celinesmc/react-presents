import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { backendURL } from "../Globals";

let ChoosePresentComponent = (props) => {
    let navigate = useNavigate();
    let param = useParams();
    let id = param.id;

    let { createNotification } = props

    useEffect( () => {
        choosePresent();
    }, [])

    let choosePresent = async () => {
        let response = await fetch(backendURL+"/presents/"+id+"?apiKey="
        +localStorage.getItem("apiKey"), {
            method: "PUT"
        })

        if (response.status == 401){
            navigate("/login")
            return
        }

        if (response.ok){
            createNotification("Chosen correctly")
            navigate("/myPresents")
        } else {
            let jsonData = await response.json();
            navigate("/myPresents")
            createNotification(jsonData.error)
        }
    }

    return (
        <>
        </>
    )

}

export default ChoosePresentComponent;