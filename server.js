const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir archivos estáticos como index.html
app.use(express.static(__dirname));

let userCount = 0;

// Función para generar un ID aleatorio
function generateRandomId() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// Función para generar un color aleatorio en formato hexadecimal
function generateRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

// Manejo de conexión de socket.io
io.on('connection', (socket) => {
  userCount++;
  const userId = generateRandomId(); // Asignar ID único
  const userColor = generateRandomColor(); // Asignar color único

  console.log(`User connected: ${userId} with color ${userColor}`);
  io.emit('user count', userCount); // Actualiza el número de usuarios conectados a todos

  // Escucha de mensajes de chat
  socket.on('chat message', (msg) => {
    console.log(`Message from ${userId}: ${msg}`);
    // Enviar mensaje con ID y color
    io.emit('chat message', { id: userId, text: msg, color: userColor });
  });

  // Manejo de desconexión
  socket.on('disconnect', () => {
    userCount--;
    console.log(`User disconnected: ${userId}`);
    io.emit('user count', userCount); // Actualiza el número de usuarios conectados
  });
});

// Inicio del servidor en el puerto 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
