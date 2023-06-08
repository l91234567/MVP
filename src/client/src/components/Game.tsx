import react,{useRef, useState, useEffect, useContext} from 'react';
import {SocketContext} from './socket.js';

type props = {
  currentPlayerId:string
}
export default function Game({currentPlayerId}:props) {

  const socket = useContext(SocketContext);
  const [id, setId] = useState('-1');
  socket.on('id', (data:any)=>{
    setId(data)
  })


  var connections:any = {};
  socket.on('newConnect', (data:any) => {
    connections = data.connections

  })

  socket.on('disconnection', (data:any) => {
    connections = data.connections
  })

  socket.on('drawing',(data:any)=>{

    var canvas= canvasRef.current!;
    context = (canvas as HTMLCanvasElement).getContext('2d')
    const x = data[0];
    const y = data[1];

    context.lineWidth = 3;
    context.lineCap = 'round';
    context.strokeStyle = '#000';

    context.lineTo(x, y);

    context.stroke();
    context.beginPath();
    context.moveTo(x, y);



  })

  socket.on('stopDrawing', (data:string)=>{
    var canvas= canvasRef.current!;
    context = (canvas as HTMLCanvasElement).getContext('2d')
    context.beginPath();
  })





  const canvasRef = useRef(null)!;



  let isDrawing = false;
  let context:any;



  useEffect(()=> {

    const canvas= canvasRef.current!;
    context = (canvas as HTMLCanvasElement).getContext('2d')


    const resizeCanvas = () => {
      (canvas as HTMLCanvasElement).width = 800;
      (canvas as HTMLCanvasElement).height = 500;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [currentPlayerId])

  function startDrawing(event:any):any {

    if(currentPlayerId !== id) return;
    isDrawing = true;
    draw(event);
  }

  function draw(event:any) {
    if(currentPlayerId !== id) return;
    if (!isDrawing) return;


    var canvas= canvasRef.current!;
    context = (canvas as HTMLCanvasElement).getContext('2d')
    const x = event.clientX - (canvas as HTMLCanvasElement).offsetLeft - 1;
    const y = event.clientY - (canvas as HTMLCanvasElement).offsetTop - 1;

    context.lineWidth = 3;
    context.lineCap = 'round';
    context.strokeStyle = '#000';

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
    socket.emit('drawing', [x, y])
  }

  function stopDrawing() {
    if(currentPlayerId !== id) return;
    isDrawing = false;
    var canvas= canvasRef.current!;
    context = (canvas as HTMLCanvasElement).getContext('2d')
    context.beginPath();
    socket.emit('stopDrawing', 'stop')
  }

  return(<>
   <canvas id='canvas' ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw}onMouseUp={stopDrawing} onMouseOut={stopDrawing} />
  </>)
}