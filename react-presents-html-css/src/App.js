import { Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { backendURL } from './Globals';

import './App.css';

let App = () => {
  let [login, setLogin] = useState(false);
  let [notification, setNotification] = useState("");
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    checkLogin();
  },[])

  let checkLogin = async () => {
    if(localStorage.getItem("apiKey") != "null"){
      let response = await fetch(backendURL+"/users/checkLogin?apiKey="+localStorage.getItem("apiKey"))
      if (response.status == 401 || response.status == 500){ 
        navigate("/login");
        return
      } else {
        setLogin(true);
      }
    } else { 
      let href = location.pathname 
      if(["/login","/register"].includes(href) == false){ 
        navigate("/login")
      }
      setLogin(false);
    }
  }

  let disconnect = async () => {
    let response = await fetch (backendURL+"/users/disconnect?apiKey="+localStorage.getItem("apiKey"))

    if (response.ok){
      localStorage.removeItem("apiKey")
      setLogin(false)
      navigate("/login")
    }
  }

  let createNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 3000)
  }

  return (
    <div className="App">
      <nav>
        <li><Link to="/">Index</Link></li>
        { !login && <li><Link to="/register">Register</Link></li>}
        { !login && <li><Link to="/login">Login</Link></li>}
        { login && <li><Link to="/createPresent">Create presents</Link></li>}
        { login && <li><Link to="/myPresents">My presents</Link></li>}
        { login && <li><Link to="/friends">Friends list</Link></li>}
        { login && <li><Link to="#" onClick={disconnect}>Disconnect</Link></li>}
      </nav>

    { notification != "" && (
      <div className="notification">
        { notification }
        <span className="close-btn" onClick={() => {setNotification("")}}>X</span>
      </div>
    )}
  
    <Routes>
      {/*
    <Route path="/" element={
      <IndexComponent/>
    }/>*/}
    </Routes>
  </div>
  );
}

export default App;
