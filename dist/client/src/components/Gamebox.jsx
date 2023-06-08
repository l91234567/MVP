import { useState, useContext } from 'react';
import Game from './Game.jsx';
import { SocketContext } from './socket.js';
export default function Gamebox() {
    const socket = useContext(SocketContext);
    const [id, setId] = useState('-1');
    socket.on('id', (data) => {
        setId(data);
    });
    const [currentPlayerId, setCurrentPlayerId] = useState('');
    socket.on('currentPlayerId', (data) => {
        setCurrentPlayerId(data);
    });
    socket.on('currentRound', (data) => {
        console.log;
        var { currentPlayerId, targetWord } = data;
        if (currentPlayerId === socket.id) {
            setTask(` Draw ${targetWord}`);
        }
        else {
            setTask(`Guess`);
        }
    });
    const [task, setTask] = useState('');
    var props = {
        currentPlayerId: currentPlayerId
    };
    return (<>

  <div id='gameBox'>
    <div id='task'>
      <h1>Task </h1>
      <p>{task}</p>

    </div>

    <Game {...props}/>

  </div>
  </>);
}
