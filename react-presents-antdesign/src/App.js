import CreateUserComponent from './Components/CreateUserComponent';
import LoginUserComponent from './Components/LoginUserComponent';
import CreatePresentsComponent from './Components/CreatePresentsComponent';
import MyPresentsComponent from './Components/MyPresentsComponent';
import EditPresentComponent from './Components/EditPresentComponent';
import AddFriendComponent from './Components/AddFriendComponent';
import FriendsListComponent from './Components/FriendsListComponent';
import SearchPresentComponent from './Components/SearchPresentComponent';
import ChoosePresentComponent from './Components/ChoosePresentComponent';
import IndexComponent from './Components/IndexComponent';

import { Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { backendURL } from './Globals';

import { Layout, Menu, notification} from 'antd';
let {Header, Content, Footer} = Layout;

let App = () => {
  const [api, contextHolder] = notification.useNotification()
  let [login, setLogin] = useState(false)
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

  notification.config({
    maxCount: 1
  });

  // Lo sitúo aquí para utilizarlo en el resto de componentes y que se vea en toda la aplicación
  let createNotification = (msg, type="info", placement="top") => {
    api[type]({
      message: msg,
      description: msg,
      showProgress: true,
      placement
    })
  }

  let disconnect = async () => {
    let response = await fetch (backendURL+"/users/disconnect?apiKey="+localStorage.getItem("apiKey"))

    if (response.ok){
      localStorage.removeItem("apiKey")
      setLogin(false)
      navigate("/login")
    }
  }

  return (
    <>
    {contextHolder} 
    <Layout className='layout' style={{minHeight: '100vh'}}>
      <Header>
        { !login && ( 
            <Menu theme="dark" mode="horizontal" items={[ 
              {key: "index", label: <Link to ="/">Index</Link>},
              {key: "menuRegister", label: <Link to ="/register">Register</Link>},
              {key: "menuLogin", label: <Link to ="/login">Login</Link>},
            ]}>
            </Menu>
        )}
        { login && ( 
            <Menu theme="dark" mode="horizontal" items={[
              {key: "index", label: <Link to ="/">Index</Link>},
              {key: "menuCreatePresents", label: <Link to="/createPresents">Create presents</Link>},
              {key: "menuMyPresents", label: <Link to="myPresents">My presents</Link>},
              {key: "menuMyFriends", label: <Link to="friends">Friends list</Link>},
              {key: "menuDisconnect", label: <Link onClick={disconnect}>Disconnect</Link>}
            ]}>
         </Menu>
        )}
      </Header>
      <Content style={{padding: '20px 50px'}}>
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
          <Route path="/presents/edit/:presentId" element={
            <EditPresentComponent createNotification={createNotification}/>
          }/>
          <Route path="/friends" element={
            <FriendsListComponent createNotification={createNotification}/>
          }/>
          <Route path="/addFriends" element={
            <AddFriendComponent createNotification={createNotification}/>
          }/>
          <Route path="/presents/search/:userEmail" element={
            <SearchPresentComponent createNotification={createNotification}/>
          }/>
          <Route path="/presents/choose/:id" element={
            <ChoosePresentComponent createNotification={createNotification}/>
          }/>
          <Route path="/" element={
            <IndexComponent/>
          }/>
        </Routes>
      </Content>
      <Footer style={{textAlign:"center"}}> Presents Website </Footer>
    </Layout>
    </>
  );
}

export default App;
