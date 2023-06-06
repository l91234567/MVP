import { useState, useContext } from 'react';
const io = require('socket.io-client');
import { SocketContext } from './socket.js';
import React from 'react';
import Gamebox from './Gamebox.jsx';
import Chatbox from './Chatbox.jsx';
export default function App() {
    const socket = useContext(SocketContext);
    const [clientId, setClientId] = useState('');
    socket.on('id', (data) => {
        console.log(typeof data);
    });
    const props = { clientId: clientId };
    return (<div id="app">
    <SocketContext.Provider value={socket}>
      <Gamebox {...props}/>
      <Chatbox />
    </SocketContext.Provider>
  </div>);
}
