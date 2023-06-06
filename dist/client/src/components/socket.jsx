const io = require('socket.io-client');
import 'dotenv/config';
import { createContext } from 'react';
export const socket = io.connect(process.env.SOCKET_URL);
export const SocketContext = createContext(socket);
