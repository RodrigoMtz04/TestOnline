import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Configurar Socket.io con soporte para Vercel
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowUpgrades: true,
  pingInterval: 25000,
  pingTimeout: 60000
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Almacenar salas y jugadores
const rooms = new Map();
const players = new Map();

// Estructura de sala
class GameRoom {
  constructor(roomId) {
    this.roomId = roomId;
    this.players = new Map();
    this.createdAt = Date.now();
    this.gameState = {
      bullets: [],
      enemies: []
    };
  }

  addPlayer(playerId, playerData) {
    this.players.set(playerId, {
      id: playerId,
      x: playerData.x || Math.random() * 800,
      y: playerData.y || Math.random() * 600,
      angle: 0,
      speed: 200,
      health: 100,
      isAlive: true,
      ...playerData
    });
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
  }

  getPlayerData(playerId) {
    return this.players.get(playerId);
  }

  updatePlayer(playerId, data) {
    const player = this.players.get(playerId);
    if (player) {
      Object.assign(player, data);
    }
  }

  isEmpty() {
    return this.players.size === 0;
  }
}

// Conexión de socket
io.on('connection', (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);

  // Crear o unirse a una sala
  socket.on('joinRoom', (data) => {
    const { roomId, playerName } = data;

    // Crear sala si no existe
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new GameRoom(roomId));
    }

    const room = rooms.get(roomId);
    socket.join(roomId);
    players.set(socket.id, { roomId, playerName });

    // Agregar jugador a la sala
    room.addPlayer(socket.id, { name: playerName });

    // Enviar estado actual a todos en la sala
    const playersData = Array.from(room.players.values());
    io.to(roomId).emit('playerJoined', {
      playerId: socket.id,
      playerName,
      allPlayers: playersData
    });

    console.log(`${playerName} se unió a sala ${roomId}`);
  });

  // Actualizar posición del jugador
  socket.on('playerMove', (data) => {
    const playerInfo = players.get(socket.id);
    if (playerInfo) {
      const room = rooms.get(playerInfo.roomId);
      if (room) {
        room.updatePlayer(socket.id, {
          x: data.x,
          y: data.y,
          angle: data.angle
        });

        // Broadcast a todos en la sala
        io.to(playerInfo.roomId).emit('playerMoved', {
          playerId: socket.id,
          x: data.x,
          y: data.y,
          angle: data.angle
        });
      }
    }
  });

  // Disparo del jugador
  socket.on('playerShoot', (data) => {
    const playerInfo = players.get(socket.id);
    if (playerInfo) {
      const room = rooms.get(playerInfo.roomId);
      const player = room?.getPlayerData(socket.id);

      if (player) {
        const bullet = {
          id: `${socket.id}-${Date.now()}`,
          playerId: socket.id,
          x: player.x,
          y: player.y,
          angle: data.angle,
          speed: 400
        };

        // Broadcast del disparo
        io.to(playerInfo.roomId).emit('bulletFired', bullet);
      }
    }
  });

  // Impacto de bala
  socket.on('bulletHit', (data) => {
    const playerInfo = players.get(socket.id);
    if (playerInfo) {
      const room = rooms.get(playerInfo.roomId);
      const targetPlayer = room?.getPlayerData(data.targetPlayerId);

      if (targetPlayer) {
        targetPlayer.health -= data.damage || 10;

        if (targetPlayer.health <= 0) {
          targetPlayer.isAlive = false;
        }

        io.to(playerInfo.roomId).emit('playerHit', {
          playerId: data.targetPlayerId,
          health: targetPlayer.health,
          isAlive: targetPlayer.isAlive
        });
      }
    }
  });

  // Desconexión
  socket.on('disconnect', () => {
    const playerInfo = players.get(socket.id);
    if (playerInfo) {
      const room = rooms.get(playerInfo.roomId);
      if (room) {
        room.removePlayer(socket.id);
        io.to(playerInfo.roomId).emit('playerLeft', { playerId: socket.id });

        // Eliminar sala si está vacía
        if (room.isEmpty()) {
          rooms.delete(playerInfo.roomId);
        }
      }
      players.delete(socket.id);
    }
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;

// Health check endpoint para Vercel
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    rooms: rooms.size,
    players: players.size
  });
});

// Endpoint raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Keep-alive para evitar timeouts en Vercel
setInterval(() => {
  const now = new Date().toISOString();
  console.log(`[${now}] Keep-alive: ${rooms.size} salas, ${players.size} jugadores`);
}, 25000);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});


