import CreateUserComponent from './Components/CreateUserComponent';
import LoginUserComponent from './Components/LoginUserComponent';
import CreatePresentsComponent from './Components/CreatePresentsComponent';
import MyPresentsComponent from './Components/MyPresentsComponent';

import FriendsListComponent from './Components/FriendsListComponent';
import AddFriendComponent from './Components/AddFriendComponent';

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
    <div className="container">
      <header class="header">
        <nav>
          <ul className='navbar-links'>
            <li><Link to="/" className='navbar-links'>Index</Link></li>
            { !login && <li><Link to="/register" className='navbar-links'>Register</Link></li>}
            { !login && <li><Link to="/login" className='navbar-links'>Login</Link></li>}
            { login && <li><Link to="/createPresents" className='navbar-links'>Create presents</Link></li>}
            { login && <li><Link to="/myPresents" className='navbar-links'>My presents</Link></li>}
            { login && <li><Link to="/friends" className='navbar-links'>Friends list</Link></li>}
            { login && <li><Link to="#" onClick={disconnect} className='navbar-links'>Disconnect</Link></li>}
          </ul>
        </nav>
      </header>

    { notification != "" && (
      <div className="notification">
        { notification }
        <span className="close-btn" onClick={() => {setNotification("")}}>X</span>
      </div>
    )}
  
    <Routes>
      <Route path="/register" element={
        <CreateUserComponent createNotification={createNotification}/>
      }/>
      <Route path="/login" element={
        <LoginUserComponent setLogin={setLogin}/>
      }/>
      <Route path="/createPresents" element={
        <CreatePresentsComponent createNotification={createNotification}/>
      }/>
      <Route path="/myPresents" element={
        <MyPresentsComponent createNotification={createNotification}/>
      }/>
      <Route path="/friends" element={
        <FriendsListComponent createNotification={createNotification}/>
      }/>
      <Route path="/addFriends" element={
        <AddFriendComponent createNotification={createNotification}/>
      }/>
      {/*
    <Route path="/" element={
      <IndexComponent/>
    }/>*/}
    </Routes>
  </div>
  );
}

export default App;
