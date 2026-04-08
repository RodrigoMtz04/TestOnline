# Ejemplos de Extensión del Código

Este archivo contiene ejemplos de cómo agregar nuevas características al juego.

---

## 1️⃣ Agregar Sistema de Puntuación

### Backend (server.js)

```javascript
// Agregar en la clase GameRoom
class GameRoom {
  // ...existing code...
  constructor(roomId) {
    this.roomId = roomId;
    this.players = new Map();
    this.createdAt = Date.now();
    this.gameState = {
      bullets: [],
      enemies: []
    };
    this.scores = new Map(); // ← AGREGAR
  }

  updateScore(playerId, points) {
    const currentScore = this.scores.get(playerId) || 0;
    this.scores.set(playerId, currentScore + points);
    return this.scores.get(playerId);
  }

  getLeaderboard() {
    return Array.from(this.scores.entries())
      .map(([playerId, score]) => ({ playerId, score }))
      .sort((a, b) => b.score - a.score);
  }
}

// Agregar manejador de evento para impacto
socket.on('bulletHit', (data) => {
  const playerInfo = players.get(socket.id);
  if (playerInfo) {
    const room = rooms.get(playerInfo.roomId);
    const targetPlayer = room?.getPlayerData(data.targetPlayerId);

    if (targetPlayer) {
      targetPlayer.health -= data.damage || 10;
      
      if (targetPlayer.health <= 0) {
        targetPlayer.isAlive = false;
        // ← AGREGAR PUNTUACIÓN
        const score = room.updateScore(socket.id, 10);
        io.to(playerInfo.roomId).emit('playerScored', {
          playerId: socket.id,
          points: 10,
          totalScore: score,
          leaderboard: room.getLeaderboard()
        });
      }

      io.to(playerInfo.roomId).emit('playerHit', {
        playerId: data.targetPlayerId,
        health: targetPlayer.health,
        isAlive: targetPlayer.isAlive
      });
    }
  }
});
```

### Frontend (public/index.html)

```javascript
// Agregar en setupSocketListeners()
socket.on('playerScored', (data) => {
  console.log(`${data.playerId} anotó ${data.points} puntos`);
  
  // Actualizar UI con leaderboard
  updateLeaderboard(data.leaderboard);
  
  // Mostrar notificación
  if (data.playerId === currentPlayerId) {
    showNotification(`+${data.points} puntos! Total: ${data.totalScore}`);
  }
});

function updateLeaderboard(leaderboard) {
  const leaderboardDiv = document.getElementById('leaderboard');
  leaderboardDiv.innerHTML = '<strong>Tabla:</strong>';
  
  leaderboard.forEach((entry, index) => {
    const item = document.createElement('div');
    item.className = 'leaderboard-item';
    item.textContent = `${index + 1}. ${entry.playerId}: ${entry.score}`;
    leaderboardDiv.appendChild(item);
  });
}

function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = message;
  document.body.appendChild(notif);
  
  setTimeout(() => notif.remove(), 3000);
}
```

---

## 2️⃣ Agregar Diferentes Tipos de Armas

### Backend (server.js)

```javascript
// Agregar constantes de armas
const WEAPONS = {
  PISTOL: { damage: 10, firerate: 0.3, speed: 400 },
  SHOTGUN: { damage: 30, firerate: 1.0, speed: 300 },
  RIFLE: { damage: 20, firerate: 0.1, speed: 500 }
};

// Agregar en PlayerData
addPlayer(playerId, playerData) {
  this.players.set(playerId, {
    id: playerId,
    x: playerData.x || Math.random() * 800,
    y: playerData.y || Math.random() * 600,
    angle: 0,
    speed: 200,
    health: 100,
    isAlive: true,
    weapon: 'PISTOL', // ← AGREGAR
    lastShoot: 0, // ← AGREGAR
    ...playerData
  });
}

// Mejorar manejo de disparo
socket.on('playerShoot', (data) => {
  const playerInfo = players.get(socket.id);
  if (playerInfo) {
    const room = rooms.get(playerInfo.roomId);
    const player = room?.getPlayerData(socket.id);

    if (player) {
      const now = Date.now();
      const weapon = WEAPONS[player.weapon];
      const timeSinceLastShoot = (now - player.lastShoot) / 1000;

      // Validar que sea tiempo de disparar
      if (timeSinceLastShoot >= weapon.firerate) {
        player.lastShoot = now;

        const bullet = {
          id: `${socket.id}-${Date.now()}`,
          playerId: socket.id,
          x: player.x,
          y: player.y,
          angle: data.angle,
          speed: weapon.speed,
          damage: weapon.damage,
          weapon: player.weapon
        };

        io.to(playerInfo.roomId).emit('bulletFired', bullet);
      }
    }
  }
});

// Agregar evento para cambiar arma
socket.on('changeWeapon', (data) => {
  const playerInfo = players.get(socket.id);
  if (playerInfo) {
    const room = rooms.get(playerInfo.roomId);
    const player = room?.getPlayerData(socket.id);
    
    if (player && WEAPONS[data.weapon]) {
      player.weapon = data.weapon;
      io.to(playerInfo.roomId).emit('weaponChanged', {
        playerId: socket.id,
        weapon: data.weapon
      });
    }
  }
});
```

### Frontend (public/index.html)

```javascript
// Agregar en setupSocketListeners()
socket.on('weaponChanged', (data) => {
  if (data.playerId === currentPlayerId) {
    document.getElementById('currentWeapon').textContent = data.weapon;
  }
});

// Agregar controles de arma en el juego
function create() {
  // ...existing code...
  
  // Agregar listener para cambio de arma (números 1-3)
  this.input.keyboard.on('keydown-ONE', () => changeWeapon('PISTOL'));
  this.input.keyboard.on('keydown-TWO', () => changeWeapon('SHOTGUN'));
  this.input.keyboard.on('keydown-THREE', () => changeWeapon('RIFLE'));
}

function changeWeapon(weaponName) {
  if (socket) {
    socket.emit('changeWeapon', { weapon: weaponName });
  }
}
```

---

## 3️⃣ Agregar Sistema de Chat

### Backend (server.js)

```javascript
// Agregar manejador de mensajes
socket.on('sendMessage', (data) => {
  const playerInfo = players.get(socket.id);
  if (playerInfo) {
    const message = {
      playerId: socket.id,
      playerName: playerInfo.playerName,
      text: data.text,
      timestamp: new Date().toISOString()
    };

    // Broadcast a la sala
    io.to(playerInfo.roomId).emit('messageReceived', message);
    console.log(`[${playerInfo.roomId}] ${playerInfo.playerName}: ${data.text}`);
  }
});
```

### Frontend (public/index.html)

```javascript
// Agregar en setupSocketListeners()
socket.on('messageReceived', (message) => {
  addChatMessage(message.playerName, message.text);
});

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (message && socket) {
    socket.emit('sendMessage', { text: message });
    input.value = '';
  }
}

function addChatMessage(playerName, text) {
  const chatBox = document.getElementById('chatBox');
  const messageElement = document.createElement('div');
  messageElement.className = 'chat-message';
  messageElement.innerHTML = `<strong>${playerName}:</strong> ${text}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// HTML para agregar en index.html
// <div id="chatBox" style="..."></div>
// <input type="text" id="chatInput" placeholder="Escribe un mensaje...">
// <button onclick="sendChatMessage()">Enviar</button>
```

---

## 4️⃣ Agregar Power-ups

### Backend (server.js)

```javascript
class GameRoom {
  // ...existing code...
  constructor(roomId) {
    // ...existing code...
    this.powerups = [];
  }

  spawnPowerup() {
    const types = ['HEALTH', 'SHIELD', 'AMMO'];
    const powerup = {
      id: `powerup-${Date.now()}`,
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * 1600,
      y: Math.random() * 900,
      radius: 20
    };
    this.powerups.push(powerup);
    return powerup;
  }
}

// Generar power-ups cada 10 segundos
setInterval(() => {
  rooms.forEach((room, roomId) => {
    if (room.powerups.length < 3) {
      const powerup = room.spawnPowerup();
      io.to(roomId).emit('powerupSpawned', powerup);
    }
  });
}, 10000);

// Manejador de recolección
socket.on('collectPowerup', (data) => {
  const playerInfo = players.get(socket.id);
  if (playerInfo) {
    const room = rooms.get(playerInfo.roomId);
    const player = room?.getPlayerData(socket.id);
    const powerupIndex = room?.powerups.findIndex(p => p.id === data.powerupId);

    if (powerupIndex !== -1 && player) {
      const powerup = room.powerups[powerupIndex];
      room.powerups.splice(powerupIndex, 1);

      switch (powerup.type) {
        case 'HEALTH':
          player.health = Math.min(100, player.health + 25);
          break;
        case 'SHIELD':
          player.shield = (player.shield || 0) + 50;
          break;
        case 'AMMO':
          player.ammo = 999;
          break;
      }

      io.to(playerInfo.roomId).emit('powerupCollected', {
        powerupId: data.powerupId,
        playerId: socket.id,
        effect: powerup.type
      });
    }
  }
});
```

---

## 5️⃣ Agregar Minimapa

### Frontend (public/index.html)

```javascript
// En la función create()
createMinimap() {
  const minimapWidth = 200;
  const minimapHeight = 150;
  const minimapScale = 0.1;

  this.minimapGraphics = this.add.graphics();
  this.minimapGraphics.setDepth(100);
  this.minimapGraphics.setPosition(10, 10);

  // Dibujar fondo del minimapa
  this.minimapGraphics.fillStyle(0x000000, 0.8);
  this.minimapGraphics.fillRect(0, 0, minimapWidth, minimapHeight);
  this.minimapGraphics.lineStyle(2, 0x00ff00);
  this.minimapGraphics.strokeRect(0, 0, minimapWidth, minimapHeight);
}

// En update()
function updateMinimap() {
  if (this.minimapGraphics) {
    this.minimapGraphics.clear();
    
    // Dibujar fondo
    this.minimapGraphics.fillStyle(0x000000, 0.8);
    this.minimapGraphics.fillRect(0, 0, 200, 150);
    this.minimapGraphics.lineStyle(2, 0x00ff00);
    this.minimapGraphics.strokeRect(0, 0, 200, 150);

    const minimapScale = 0.1;

    // Dibujar jugador
    this.minimapGraphics.fillStyle(0x00ff00);
    this.minimapGraphics.fillCircle(
      playerSprite.x * minimapScale,
      playerSprite.y * minimapScale,
      3
    );

    // Dibujar otros jugadores
    this.minimapGraphics.fillStyle(0xff0000);
    Object.values(remotePlayers).forEach(player => {
      this.minimapGraphics.fillCircle(
        player.x * minimapScale,
        player.y * minimapScale,
        2
      );
    });

    // Dibujar balas
    this.minimapGraphics.fillStyle(0xffff00);
    bullets.forEach(bullet => {
      this.minimapGraphics.fillRect(
        bullet.x * minimapScale - 1,
        bullet.y * minimapScale - 1,
        2,
        2
      );
    });
  }
}
```

---

## Conclusión

Estos ejemplos muestran cómo extender el juego. Puedes combinarlos y crear nuevas características basándote en estos patrones.

Para más información sobre las APIs de Socket.io y Phaser, consulta:
- https://socket.io/docs/
- https://photonstorm.github.io/phaser3-docs/

---

