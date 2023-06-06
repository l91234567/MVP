import { useContext } from 'react';
import Game from './Game.jsx';
import { SocketContext } from './socket.js';
export default function Gamebox({ clientId }) {
    const socket = useContext(SocketContext);
    return (<>

  <div id='gameBox'>
    <div id='task'>
      <h1>task</h1>
    </div>

    <Game />

  </div>
  </>);
}
