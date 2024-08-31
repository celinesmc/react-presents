import { useEffect, useState} from "react"
import { useNavigate, useParams } from "react-router-dom";

import { backendURL } from "../Globals";

let EditPresentComponent = (props) => {
    let { createNotification } = props
    let [presents, setPresents] = useState({});
    let { presentId } = useParams()
    let [message, setMessage] = useState("");
    let navigate = useNavigate();



    let getPresent = async () => {
        let response = await fetch(backendURL+"/presents/"+presentId+"?apiKey="+localStorage.getItem("apiKey"))

        if (response.ok){
            let jsonData = await response.json();
            setPresents(jsonData[0])
        } else {
            setMessage("Error")
        }
    }

    useEffect(() => {
        getPresent();
    }, [])

    let clickEdit = async () => {
        let response = await fetch(backendURL+"/presents/"+presentId+"?apiKey="+localStorage.getItem("apiKey"), {
            method: "PUT",
            headers: { "Content-Type" : "application/json"},
            body: JSON.stringify(presents)
        })

        if (response.ok){
            createNotification("Present has been edited correctly")
            navigate("/myPresents")
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let changeProperty = (propertyName, value)=> {
        let newPresentValues = {...presents,[propertyName] : value }
        setPresents(newPresentValues)
    }

    return (
        <div className="form-container">
        <div className="form-search-container">
        { message != "" && <p className="error-message">{message}</p>}
            <form className="form">
            <h2 className="form-title">Edit present</h2>
                <input 
                onChange={(e) => changeProperty("name", e.currentTarget.value)}
                className="input-form" type="text" 
                value={presents?.name}
                placeholder="your name"/>
                <input 
                onChange={(e) => changeProperty("description", e.currentTarget.value)}
                className="input-form" type="text" 
                placeholder="your description"
                value={presents?.description}/>
                <input 
                onChange={(e) => changeProperty("url", e.currentTarget.value)}
                className="input-form" type="text" 
                placeholder="your url" 
                value={presents?.url}/>
                <input 
                onChange={(e) => changeProperty("price", e.currentTarget.value)}
                className="input-form" type="number" 
                placeholder="your price"
                value={presents?.price}/>
                <button type="primary" 
                className="normal-button"
                onClick={clickEdit}
                block>Edit present</button>
            </form>
    </div>
    </div>
    )
}

export default EditPresentComponent