const io = require('socket.io-client');
import { createContext } from 'react';
export const socket = io.connect('http://localhost:3002');
export const SocketContext = createContext(socket);
