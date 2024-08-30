import CreateUserComponent from './Components/CreateUserComponent';

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

  // Lo sitúo aquí para utilizarlo en el resto de componentes y que se vea en toda la aplicación
  let createNotification = (msg, type="info", placement="top") => {
    api[type]({
      message: msg,
      description: msg,
      placement
    })
  }

  return (
    <>
    {contextHolder} 
    <Layout className='layout' style={{minHeight: '100vh'}}>
      <Header>
        { !login && ( 
            <Menu theme="dark" mode="horizontal" items={[ 
              {key: "menuRegister", label: <Link to ="/register">Register</Link>},
              {key: "menuLogin", label: <Link to ="/login">Login</Link>},
            ]}>
            </Menu>
        )}
        { login && ( 
         <Menu theme="dark" mode="horizontal" items={[
          ]}>
         </Menu>
        )}
      </Header>
      <Content style={{padding: '20px 50px'}}>
        <Routes>
          <Route path="/register" element={
            <CreateUserComponent createNotification={createNotification}/>
          }/>
          <Route path="/" element={
            <p>Index of website</p>
          }/>
        </Routes>
      </Content>
      <Footer style={{textAlign:"center"}}> Presents Website </Footer>
    </Layout>
    </>
  );
}

export default App;
