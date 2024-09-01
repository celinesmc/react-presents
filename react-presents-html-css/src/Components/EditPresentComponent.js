import { useEffect, useState} from "react"
import { useNavigate, useParams } from "react-router-dom";

import { backendURL } from "../Globals";

let EditPresentComponent = (props) => {
    let { createNotification } = props
    let [error, setError] = useState("")
    let [presents, setPresents] = useState({});
    let { presentId } = useParams()
    let [message, setMessage] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        getPresent();
    }, [])

    useEffect(() => {
        checkInputErrors();
    },[presents])

    let checkInputErrors = () => {
        let updatedErrors = {}

        if (presents.name == "" || presents.name?.length < 3){
            updatedErrors.name = "Too short name"
        }
        if (presents.description == "" || presents.description?.length < 3){
            updatedErrors.description = "Too short description"
        }
        if (presents.price == "" || presents.price < 0){
            updatedErrors.price = "Must 0 or positive"
        }
        if (presents.url == "" || presents.url?.length < 3){
            updatedErrors.url = "Too short url"
        }

        setError(updatedErrors)
    }


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

        try {
        if (response.ok){
            setMessage("Modified")
            createNotification("Present has been edited correctly")
            navigate("/myPresents")
        } else {
            let jsonData = await response.json();
            if (Array.isArray(jsonData.error)){
                let finalErrorMessage = "";
                jsonData.error.forEach(obj => 
                    { finalErrorMessage += obj + " "})
                setMessage(finalErrorMessage)
            } else {
                setMessage(jsonData.error)
            }
        }} catch (error) {
            console.log(error);
            createNotification("Error editing")
            navigate("/myPresents")
        }
    }

    let changeProperty = (propertyName, e)=> {
        let newPresentValues = {...presents,[propertyName] : e.currentTarget.value }
        setPresents(newPresentValues)
    }

    return (
        <div className="form-container">
        <div className="form-search-container">
        { message != "" && <p className="error-message">{message}</p>}
            <div className="form">
            <h2 className="form-title">Edit present</h2>
                <input 
                onChange={(e) => changeProperty("name", e)}
                className="input-form" type="text" 
                value={presents?.name}
                placeholder="your name"/>
                { error.name && <p className="form-message">{error.name}</p>}
                <input 
                onChange={(e) => changeProperty("description", e)}
                className="input-form" type="text" 
                placeholder="your description"
                value={presents?.description}/>
                { error.description && <p className="form-message">{error.description}</p>}
                <input 
                onChange={(e) => changeProperty("url", e)}
                className="input-form" type="text" 
                placeholder="your url" 
                value={presents?.url}/>
                { error.price && <p className="form-message">{error.price}</p>}
                <input 
                onChange={(e) => changeProperty("price", e)}
                className="input-form" type="number" 
                placeholder="your price"
                value={presents?.price}/>
                { error.url && <p className="form-message">{error.url}</p>}
                <button
                className="normal-button"
                onClick={clickEdit}
                block>Edit present</button>
            </div>
    </div>
    </div>
    )
}

export default EditPresentComponent