# Arquitectura del Proyecto

## 🏗️ Estructura del Proyecto

```
TestOnline/
├── public/
│   └── index.html              # Interfaz web del juego
├── server.js                   # Servidor Node.js + Socket.io
├── package.json                # Dependencias
├── .env                        # Variables de entorno
├── .gitignore                  # Archivos ignorados por Git
├── vercel.json                 # Config para Vercel
├── README.md                   # Documentación principal
├── DEPLOYMENT.md               # Guía de despliegue
├── CONTROLES.md                # Guía de controles
├── ARQUITECTURA.md             # Este archivo
└── manage.sh                   # Script de gestión
```

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│                     Cliente (Navegador)                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │ HTML5 Canvas + Phaser 3                           │  │
│  │ - Renderizado del juego                           │  │
│  │ - Manejo de input (teclado + mouse)              │  │
│  │ - Interpolación de movimientos                    │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↕                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Socket.io Cliente                                 │  │
│  │ - Eventos: playerMove, playerShoot, bulletHit    │  │
│  │ - Comunicación bidireccional                      │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕↕ WebSocket/Polling
┌─────────────────────────────────────────────────────────┐
│                   Servidor (Node.js)                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Express + HTTP Server                             │  │
│  │ - Servir archivos estáticos (/public)            │  │
│  │ - Health checks                                   │  │
│  │ - Manejo de peticiones HTTP                       │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↕                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Socket.io Servidor                                │  │
│  │ - Gestión de conexiones                           │  │
│  │ - Broadcast de eventos                            │  │
│  │ - Validación server-side                          │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↕                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Game State Manager                                │  │
│  │ - Salas (Map)                                     │  │
│  │ - Jugadores (Map)                                 │  │
│  │ - Estado del juego                                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 📡 Eventos Socket.io

### Cliente → Servidor

#### 1. joinRoom
```javascript
// Cliente envía
socket.emit('joinRoom', {
  roomId: 'room_a1b2c3d4',
  playerName: 'Juan'
});

// Servidor recibe y valida
// Crea sala si no existe
// Agrega jugador a sala
// Broadcast a otros jugadores
```

#### 2. playerMove
```javascript
// Enviado cada frame (~60 veces por segundo)
socket.emit('playerMove', {
  x: 400,
  y: 300,
  angle: 0.785  // radianes
});

// Servidor actualiza posición
// Broadcast a todos en la sala (excepto el remitente)
```

#### 3. playerShoot
```javascript
socket.emit('playerShoot', {
  angle: 0.785  // dirección del disparo
});

// Servidor crea objeto bala
// Broadcast del disparo a todos los jugadores
```

#### 4. bulletHit
```javascript
// Cliente detecta impacto (colisión local)
socket.emit('bulletHit', {
  targetPlayerId: 'socket-id-victima',
  damage: 10
});

// Servidor reduce vida del jugador
// Broadcast actualización de vida
```

### Servidor → Cliente

#### 1. playerJoined
```javascript
socket.on('playerJoined', (data) => {
  // data.playerId: ID del jugador que se unió
  // data.playerName: Nombre del jugador
  // data.allPlayers: Array de todos los jugadores en la sala
});
```

#### 2. playerMoved
```javascript
socket.on('playerMoved', (data) => {
  // data.playerId: ID del jugador
  // data.x, data.y: Nueva posición
  // data.angle: Rotación
  
  // Actualizar sprite del jugador remoto
});
```

#### 3. bulletFired
```javascript
socket.on('bulletFired', (bullet) => {
  // bullet.id: ID único de la bala
  // bullet.playerId: Quién disparó
  // bullet.x, bullet.y: Posición inicial
  // bullet.angle: Dirección
  // bullet.speed: Velocidad
  
  // Crear visual de bala
  // Calcular trayectoria física
});
```

#### 4. playerHit
```javascript
socket.on('playerHit', (data) => {
  // data.playerId: Quién fue impactado
  // data.health: Nueva vida
  // data.isAlive: Booleano de vida
  
  // Actualizar barra de vida
  // Si no está vivo, mostrar game over
});
```

#### 5. playerLeft
```javascript
socket.on('playerLeft', (data) => {
  // data.playerId: ID del jugador que se fue
  
  // Eliminar sprite del jugador remoto
  // Actualizar lista de jugadores
});
```

## 🎮 Loop del Juego en Cliente

```
┌─────────────────────────────────────┐
│   Inicializar Phaser Game          │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│   create() - Setup inicial          │
│   - Crear sprite del jugador        │
│   - Setup input listeners           │
│   - Conectar Socket.io              │
└────────────┬────────────────────────┘
             ↓
     ┌───────────────────┐
     │                   │
     ↓                   │
┌──────────────────────┐ │
│  update() - Loop     │ │
│  ┌────────────────┐ │ │
│  │ 1. Leer input  │ │ │
│  │ 2. Actualizar  │ │ │
│  │    posición    │ │ │
│  │ 3. Rotar hacia │ │ │
│  │    mouse       │ │ │
│  │ 4. Broadcast   │ │ │
│  │    posición    │ │ │
│  │ 5. Actualizar  │ │ │
│  │    balas       │ │ │
│  │ 6. Detectar    │ │ │
│  │    colisiones  │ │ │
│  │ 7. Renderizar  │ │ │
│  └────────────────┘ │ │
└────────────┬────────┘ │
             │          │
             └──────────┘
            (~60 FPS)
```

## 📊 Estructura de Datos del Servidor

### Clase GameRoom
```javascript
class GameRoom {
  roomId: string;
  players: Map<socketId, PlayerData>;
  createdAt: timestamp;
  gameState: {
    bullets: array;
    enemies: array;
  };
  
  addPlayer(playerId, playerData);
  removePlayer(playerId);
  getPlayerData(playerId);
  updatePlayer(playerId, data);
  isEmpty();
}
```

### PlayerData
```javascript
{
  id: 'socket-id',
  name: 'NombreJugador',
  x: 400,
  y: 300,
  angle: 0.785,
  speed: 200,
  health: 100,
  isAlive: true
}
```

### BulletData
```javascript
{
  id: 'socket-id-timestamp',
  playerId: 'socket-id',
  x: 400,
  y: 300,
  angle: 0.785,
  speed: 400
}
```

## 🌐 Compatibilidad

### Navegadores Soportados
- Chrome/Chromium 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Requisitos Mínimos
- Conexión a Internet estable
- 1920x1080 resolución recomendada
- 2+ GB RAM
- 50+ Mbps de ancho de banda

## 🚀 Escalabilidad

### Estado Actual
- Máximo ~10 jugadores por sala (limitado por sincronización)
- ~100 salas simultáneas (limitado por memoria)

### Para Escalar

#### Opción 1: Usar Adapter de Socket.io
```javascript
import { createAdapter } from "@socket.io/redis-adapter";

io.adapter(createAdapter(pubClient, subClient));
```

Permite múltiples instancias de servidor.

#### Opción 2: Usar Ably
```javascript
const ably = new Ably.Realtime(process.env.ABLY_KEY);
```

Serverless WebSockets managed.

#### Opción 3: Database Backend
Guardar estado en Redis/PostgreSQL para persistencia.

## 🔒 Seguridad

### Validaciones Actuales
- Verificar que jugador pertenezca a sala
- Validar que bala viene de jugador conectado

### Mejoras Recomendadas
- Implementar rate limiting
- Validar daño server-side
- Hash de posiciones para anti-cheat
- Autenticación de usuarios
- JWT tokens

---

Para más detalles, consulta los comentarios en `server.js` e `index.html`.

