import react,{useRef, useState, useEffect, useContext} from 'react';
import {SocketContext} from './socket.js';

type props = {
  id:string
}

export default function Chatbox() {

  const socket = useContext(SocketContext);

  var clientId:any;
  socket.on('id',(data:any)=>{
    clientId = data
  })

  var targetWord:string;
  socket.on('targetWord', (data:string)=>{
    targetWord = data;


  })

  socket.on('message', (data:any) =>{
    var {clientId, message} = data;
    if(message.trim() === '') return;
    var element = document.createElement('p');

    if(message.toUpperCase().trim() === targetWord.toUpperCase().trim()) {
      element.textContent =`${clientId} has guessed it!!`
      if(clientId === socket.id) {
        socket.emit('changeWord', socket.id);
      }

    } else {
      element.textContent = `${clientId}: ${message}`
    }

    chatterRef.current.appendChild(element);

    chatterRef.current.scrollTop = chatterRef.current.scrollHeight;

  })

  var connections:any = {};
  socket.on('newConnect', (data:any) => {
    connections = data.connections
    const id = data.id;
    var element = document.createElement('p');
    element.textContent =`${id} joined`
    chatterRef.current.appendChild(element);
    chatterRef.current.scrollTop = chatterRef.current.scrollHeight;

  })

  socket.on('disconnection', (data:any) => {
    connections = data.connections
    const id = data.id;

    var element = document.createElement('p');
    element.textContent =`${id} left`
    chatterRef.current.appendChild(element);
    chatterRef.current.scrollTop = chatterRef.current.scrollHeight;

  })


  const chatterRef:any = useRef(null)!;
  const chatInputRef:any = useRef(null)!;
  const chatEnterRef:any = useRef(null)!;




  const enterButtonOnClick = (e:any) => {
    let message = chatInputRef.current.value

    var messageInfo = {
      clientId: clientId,
      message: message}
      chatInputRef.current.value ='';
    socket.emit('message', messageInfo);
  }



  const chatInputOnKeyDown =(e:any)=> {
    if(e.key === 'Enter') {
      e.preventDefault();
      chatEnterRef.current.click();

    }
  }


  return (<>
  <div id="chatbox">

    <div id="chatter" ref={chatterRef}></div>
    <div id="chatInput">
      <input type="text" ref={chatInputRef} onKeyDown={chatInputOnKeyDown}></input>
      <input type="button" ref={chatEnterRef} value="Enter" onClick={enterButtonOnClick}></input>

    </div>
  </div>
  </>)
}