import react,{useRef, useState, useEffect, useContext} from 'react';
import Game from './Game.jsx'
import {SocketContext} from './socket.js';

type props = {clientId:any}

export default function Gamebox({clientId}:props){
  const socket = useContext(SocketContext);

  return (<>

  <div id='gameBox'>
    <div id='task'>
      <h1>task</h1>
    </div>

    <Game />

  </div>
  </>)
}