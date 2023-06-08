import { useRef, useState, useEffect, useContext } from 'react';
import { SocketContext } from './socket.js';
export default function Game({ currentPlayerId }) {
    const socket = useContext(SocketContext);
    const [id, setId] = useState('-1');
    socket.on('id', (data) => {
        setId(data);
    });
    var connections = {};
    socket.on('newConnect', (data) => {
        connections = data.connections;
    });
    socket.on('disconnection', (data) => {
        connections = data.connections;
    });
    socket.on('drawing', (data) => {
        var canvas = canvasRef.current;
        context = canvas.getContext('2d');
        const x = data[0];
        const y = data[1];
        context.lineWidth = 3;
        context.lineCap = 'round';
        context.strokeStyle = '#000';
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
    });
    socket.on('stopDrawing', (data) => {
        var canvas = canvasRef.current;
        context = canvas.getContext('2d');
        context.beginPath();
    });
    const canvasRef = useRef(null);
    let isDrawing = false;
    let context;
    useEffect(() => {
        const canvas = canvasRef.current;
        context = canvas.getContext('2d');
        const resizeCanvas = () => {
            canvas.width = 800;
            canvas.height = 500;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [currentPlayerId]);
    function startDrawing(event) {
        if (currentPlayerId !== id)
            return;
        isDrawing = true;
        draw(event);
    }
    function draw(event) {
        if (currentPlayerId !== id)
            return;
        if (!isDrawing)
            return;
        var canvas = canvasRef.current;
        context = canvas.getContext('2d');
        const x = event.clientX - canvas.offsetLeft - 1;
        const y = event.clientY - canvas.offsetTop - 1;
        context.lineWidth = 3;
        context.lineCap = 'round';
        context.strokeStyle = '#000';
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
        socket.emit('drawing', [x, y]);
    }
    function stopDrawing() {
        if (currentPlayerId !== id)
            return;
        isDrawing = false;
        var canvas = canvasRef.current;
        context = canvas.getContext('2d');
        context.beginPath();
        socket.emit('stopDrawing', 'stop');
    }
    return (<>
   <canvas id='canvas' ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseOut={stopDrawing}/>
  </>);
}
