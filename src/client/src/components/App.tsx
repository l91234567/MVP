import react,{useRef, useState, useEffect, useContext} from 'react';
const io = require('socket.io-client')
import {SocketContext, socket} from './socket.js';


import Gamebox from './Gamebox.jsx'
import Chatbox from './Chatbox.jsx'
import Options from './Options.jsx'

export default function App() {
  const socket = useContext(SocketContext);



  return (
    <div id="app">
    <SocketContext.Provider value={socket}>
      <Options />
      <Gamebox />
      <Chatbox />
    </SocketContext.Provider>
  </div>)
}