import react,{useRef, useState, useEffect, useContext} from 'react';
import {SocketContext} from './socket.js';

export default function Game() {

  const socket = useContext(SocketContext);

  socket.on('id', (data:any)=>console.log('this is my id: ', data))

  socket.on('drawing',(data:any)=>{

    const canvas= canvasRef.current!;
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
    context.beginPath();
  })
  const canvasRef = useRef(null)!;

  const [axisX, setAxisX] = useState(0)

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
  }, [])

  function startDrawing(event:any):any {

    isDrawing = true;
    draw(event);
  }

  function draw(event:any) {
    if (!isDrawing) return;


    const canvas= canvasRef.current!;
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
    isDrawing = false;

    context.beginPath();
    socket.emit('stopDrawing', 'stop')
  }

  return(<>
   <canvas id='canvas' ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw}onMouseUp={stopDrawing} onMouseOut={stopDrawing} />
  </>)
}