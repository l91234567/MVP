import react,{useRef, useState, useEffect, useContext} from 'react';
import {SocketContext} from './socket.js';
import axios from 'axios';


export default function Options() {
  const socket = useContext(SocketContext);
  socket.on('currentTopic', (data:string)=>{
    setCurrentTopic(data);
  })

  const [host, setHost] = useState(false)
  socket.on('host',(data:any)=>{
    let host = data
    let id = socket.id

    if (id=== host){

      hostRef.current.style.display = 'inherit'
      setHost(true);
    } else {
      hostRef.current.style.display = 'none'
    }
  })
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState('')
  useEffect(()=> {
    axios.get('/topics')
    .then((result:any) => {
      setTopics(result.data)
      changeTopic(result.data[0].topic)
    })
  },[])

  const topicOnChange = (e:any) =>{

    changeTopic(e.target.value)
  }

  function changeTopic(topic:string) {


    axios.get(`/topic/${topic}`)
    .then((result:any) => {

      socket.emit('currentTopic', topic)
      socket.emit('topicWords', result.data.words)
    })
    .catch((err:any) => console.log(err))
  }

  const startButtonOnClick = (e:any) => {

    setTopicSelect(true)
    socket.emit('gameStart', 'start')
  }
  const hostRef:any = useRef(null);


  const [topicSelect, setTopicSelect] = useState(false)

  socket.on('gameOver', (data:any)=> {
    setTopicSelect(false)
    var users = data
    let l:any = [];

    for(var i in users) {

      let t:any = {}
      t.points = users[i].points
      t.id = i

      l.push(t);
    }

    setLeaderBoard(l);
  })
  const [leaderboard, setLeaderBoard] = useState([]);
  socket.on('currentRound', (data:any) =>{

    var {currentPlayerId, targetWord, users} = data;
    let l:any = [];

    for(var i in users) {

      let t:any = {}
      t.points = users[i].points
      t.id = i

      l.push(t);
    }

    setLeaderBoard(l);
  })


  type topicsOject = {
    topic: string
  }

return(<>
  <div id="Options">

    <div id="currentTopic">
      <h2>Current Topic</h2>
      <p>{currentTopic}</p>
    </div>

    <div id="hostSection" ref={hostRef}>
      <h2>Select A Topic</h2>
      <select onChange={topicOnChange} disabled={topicSelect}>
        {topics.map((e:topicsOject, index:number) => {
          return(<option key={index}>{e.topic}</option>)
        })}
      </select>


        <input id="startGameButton" type='button' value="Start" onClick={startButtonOnClick} disabled={topicSelect}></input>

    </div>

    <div id="leaderboard">
    <h2>Leaderboard</h2>
        {leaderboard.map((e:any, index:number)=> {
          return (<p key={index}>{e.id}: {e.points}</p>)
        })}
    </div>



  </div>

</>)
}