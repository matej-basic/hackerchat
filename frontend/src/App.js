import HackerchatBanner from "./components/HackerchatBanner";
import LoginSignupForm from "./components/LoginSignupForm";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "./components/Header";
import GenerateKey from "./services/GenerateKey";
import React from "react";
import ChatView from "./components/ChatView";
import GetWebSocket from "./services/GetWebSocket";
 
function App() {
  const [user, setUser] = useState(null);
  const [keyPair, setKeyPair] = useState(null);
  const [websocket, setWebSocket] = useState(null)

  const GetCurrentUser = async () => {
    useEffect(() => {
      axios.get('https://hackerchat.ml/api/users/currentuser')
      .then(res => {
        const { currentUser } = res.data
        setUser(currentUser);
      }).catch(err => {
        console.log(err);
      })
    }, []);
  }

  useEffect(() => {
    const GetKeyPair = async () => {
      const pairOfKeys = await GenerateKey()
      setKeyPair(pairOfKeys)
    }

    GetKeyPair() 
    .catch(err => { console.log("Error generating key: " + err)})
  })

  GetCurrentUser();

  

  return (
    <div className="App">
      <HackerchatBanner/>
      {(user != null) ? (<><Header user={user} onChange={value => { websocket.close(); setWebSocket(null); setUser(value)}} /><ChatView onGetSocket={value => setWebSocket(value)} socket={websocket} user={user} rsaKey={keyPair}/></>) : (<LoginSignupForm onChange={value => setUser(value)} />) }
      
      
    </div>
  );
}

export default App;
