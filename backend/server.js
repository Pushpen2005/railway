import app from './src/app.js';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import { Server } from "socket.io";
import http from "http";
// Load environment variables from .env file
dotenv.config();
// Connect to MongoDB
connectDB();


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://railway-omega-green.vercel.app"],
    credentials: true,
  }
});

app.set('io', io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

server.listen(3005, () => {
  console.log('Server is running on port 3005');
});

