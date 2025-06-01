import { Server as SocketIOServer } from 'socket.io';
import { verifyTokenFromHeaders } from '../utils/auth.mjs';
import dotenv from 'dotenv';
import pg from 'pg';

const Pool = pg.Pool

dotenv.config(); 

const DATABASE_URL = process.env.DATABASE_URL ;

const pool = new Pool({
  
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

// Get consultationId from headers (or auth token)
function getConsultationIdFromHeaders(headers) {
    return headers['consultation-id']; 
  }

function initChatHandler(httpServer) {
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*', 
      },
    });

io.on('connection', async (socket) => {
    const user = verifyTokenFromHeaders(socket.handshake.headers);
    if (!user) {
      console.log('Unauthorized socket connection');
      return socket.disconnect();
    }
    console.log('Authorized socket connection from user:', user.userId);

    const consultationId = getConsultationIdFromHeaders(socket.handshake.headers);
    if (!consultationId) return;
  
    const room = `consultation-${consultationId}`;
    socket.join(room);
  
    console.log(`User joined room: ${room}`);
  
    // Receive message from client
    socket.on('chat-message', async ({ sender_id, message }) => {
      const timestamp = new Date();
  
      // 1. Save message to PostgreSQL
      await pool.query(
        `INSERT INTO messages (consultation_id, sender_id, message, timestamp)
         VALUES ($1, $2, $3, $4)`,
        [consultationId, sender_id, message, timestamp]
      );
  
      // 2. Emit message to all in room
      io.to(room).emit('chat-message', {
        sender_id: user.userId,
        message,
        timestamp,
      });
    });
  });
};
  
export default initChatHandler;