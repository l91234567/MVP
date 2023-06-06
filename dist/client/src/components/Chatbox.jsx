import { useRef, useContext } from 'react';
import { SocketContext } from './socket.js';
export default function Chatbox() {
    const socket = useContext(SocketContext);
    var clientId;
    socket.on('id', (data) => {
        clientId = data;
    });
    const chatterRef = useRef(null);
    const chatInputRef = useRef(null);
    const enterButtonOnClick = (e) => {
        let message = chatInputRef.current.value;
        var messageInfo = {
            clientId: clientId,
            message: message
        };
        socket.emit('message', messageInfo);
    };
    socket.on('message', (data) => {
        const { clientId, message } = data;
        var element = document.createElement('p');
        element.textContent = `${clientId}: ${message}`;
        chatterRef.current.appendChild(element);
    });
    return (<>
  <div id="chatbox">

    <div id="chatter" ref={chatterRef}></div>
    <div id="chatInput">
      <input type="text" ref={chatInputRef}></input>
      <input type="button" value="Enter" onClick={enterButtonOnClick}></input>

    </div>
  </div>
  </>);
}
