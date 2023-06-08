import { useRef, useState, useContext } from 'react';
import { SocketContext } from './socket.js';
export default function Chatbox() {
    const socket = useContext(SocketContext);
    var clientId;
    socket.on('id', (data) => {
        clientId = data;
    });
    var targetWord;
    socket.on('targetWord', (data) => {
        targetWord = data;
        console.log(data);
    });
    socket.on('message', (data) => {
        var { clientId, message } = data;
        if (message.trim() === '')
            return;
        var element = document.createElement('p');
        if (message.toUpperCase().trim() === targetWord.toUpperCase().trim()) {
            element.textContent = `${clientId} has guessed it!!`;
            if (clientId === socket.id) {
                socket.emit('changeWord', socket.id);
            }
        }
        else {
            element.textContent = `${clientId}: ${message}`;
        }
        chatterRef.current.appendChild(element);
        chatterRef.current.scrollTop = chatterRef.current.scrollHeight;
    });
    var connections = {};
    socket.on('newConnect', (data) => {
        connections = data.connections;
        const id = data.id;
        var element = document.createElement('p');
        element.textContent = `${id} joined`;
        chatterRef.current.appendChild(element);
        chatterRef.current.scrollTop = chatterRef.current.scrollHeight;
    });
    socket.on('disconnection', (data) => {
        connections = data.connections;
        const id = data.id;
        var element = document.createElement('p');
        element.textContent = `${id} left`;
        chatterRef.current.appendChild(element);
        chatterRef.current.scrollTop = chatterRef.current.scrollHeight;
    });
    const chatterRef = useRef(null);
    const chatInputRef = useRef(null);
    const chatEnterRef = useRef(null);
    const [currentPlayer, setCurrentPlayer] = useState();
    const [previousPlayer, setPreviousPlayer] = useState();
    const enterButtonOnClick = (e) => {
        let message = chatInputRef.current.value;
        console.log(targetWord);
        var messageInfo = {
            clientId: clientId,
            message: message
        };
        chatInputRef.current.value = '';
        socket.emit('message', messageInfo);
    };
    const chatInputOnKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            chatEnterRef.current.click();
        }
    };
    return (<>
  <div id="chatbox">

    <div id="chatter" ref={chatterRef}></div>
    <div id="chatInput">
      <input type="text" ref={chatInputRef} onKeyDown={chatInputOnKeyDown}></input>
      <input type="button" ref={chatEnterRef} value="Enter" onClick={enterButtonOnClick}></input>

    </div>
  </div>
  </>);
}
