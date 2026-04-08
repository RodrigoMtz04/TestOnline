# Shooter Top-Down Multijugador 🎮

Un juego shooter tipo top-down en tiempo real donde múltiples jugadores pueden conectarse a la misma sala mediante una ID y jugar juntos.

## Características 🌟

- ✅ Juego en tiempo real multijugador
- ✅ Sincronización de movimientos y disparos
- ✅ Sistema de salas con ID personalizable
- ✅ Físicas arcade con Phaser 3
- ✅ WebSockets con Socket.io
- ✅ Desplegable en Vercel
- ✅ Interfaz limpia y retro

## Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Cuenta en Vercel (para despliegue)

## Instalación Local

### 1. Clonar o descargar el proyecto

```bash
cd TestOnline
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar el servidor

```bash
npm run dev
```

El juego estará disponible en: `http://localhost:3000`

## Cómo Jugar 🕹️

### En el Lobby:
1. Ingresa tu nombre de jugador
2. **Opción A**: Ingresa una ID de sala existente para unirte
3. **Opción B**: Haz clic en "Crear Nueva Sala" para generar una ID aleatoria
4. Haz clic en "Unirse a Sala"

### Controles:
- **Movimiento**: `W`, `A`, `S`, `D` o Flechas
- **Apuntar**: Mueve el mouse
- **Disparar**: Click izquierdo del mouse
- **Objetivo**: Elimina a los otros jugadores

## Stack Tecnológico 🛠️

### Frontend
- **Phaser 3**: Motor de juego 2D
- **Socket.io Client**: Comunicación en tiempo real
- **HTML5 Canvas**: Renderizado

### Backend
- **Node.js**: Runtime JavaScript
- **Express**: Framework web
- **Socket.io**: WebSocket multiplayer
- **CORS**: Manejo de peticiones cross-origin

## Despliegue en Vercel 🚀

### 1. Preparar repositorio Git

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Subir a GitHub

```bash
# Crear repositorio en GitHub y hacer push
git remote add origin https://github.com/tuusuario/shooter-multiplayer.git
git branch -M main
git push -u origin main
```

### 3. Desplegar en Vercel

Opción A - CLI:
```bash
npm install -g vercel
vercel
```

Opción B - Web:
1. Ve a https://vercel.com
2. Importa el repositorio desde GitHub
3. Configura las variables de entorno (si es necesario)
4. Haz click en Deploy

### 4. URL en Vivo
Tu juego estará disponible en: `https://tu-proyecto.vercel.app`

## Estructura del Proyecto

```
TestOnline/
├── server.js              # Servidor principal con Socket.io
├── public/
│   └── index.html        # Frontend del juego
├── package.json          # Dependencias
├── .env                  # Variables de entorno
├── vercel.json           # Configuración de Vercel
└── README.md             # Este archivo
```

## Características Futuras 💡

- [ ] Sistema de equipos
- [ ] Diferentes tipos de armas
- [ ] Mapas variados
- [ ] Sistema de puntuación
- [ ] Chat en tiempo real
- [ ] Efectos de sonido y música
- [ ] Animaciones mejoradas
- [ ] Base de datos de ranking

## Solución de Problemas 🔧

### Puerto 3000 en uso
```bash
lsof -i :3000
kill -9 <PID>
```

### Socket.io no conecta
- Verifica que el servidor esté ejecutándose
- Comprueba la consola del navegador para errores
- Asegúrate que cliente y servidor compartan el mismo URL base

### Problemas con CORS
- Los CORS están permitidos para todos los orígenes en desarrollo
- Para producción, configura específicamente en `server.js`

## API de Socket.io 📡

### Cliente → Servidor

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `joinRoom` | `{roomId, playerName}` | Unirse a una sala |
| `playerMove` | `{x, y, angle}` | Actualizar posición |
| `playerShoot` | `{angle}` | Disparar |
| `bulletHit` | `{targetPlayerId, damage}` | Impacto de bala |

### Servidor → Cliente

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `playerJoined` | `{playerId, playerName, allPlayers}` | Jugador se unió |
| `playerMoved` | `{playerId, x, y, angle}` | Posición actualizada |
| `bulletFired` | `{id, playerId, x, y, angle, speed}` | Bala disparada |
| `playerHit` | `{playerId, health, isAlive}` | Impacto recibido |
| `playerLeft` | `{playerId}` | Jugador desconectado |

## Notas Técnicas 📝

- **Latencia**: La sincronización es aproximadamente en tiempo real. Para juegos competitivos, considera agregar interpolación más avanzada.
- **Escalabilidad**: El servidor actual soporta múltiples salas pero no está optimizado para miles de jugadores simultáneos.
- **Persistencia**: Los datos de las salas se pierden cuando el servidor se reinicia.

## Licencia

MIT License - Libre para usar, modificar y distribuir.

## Contacto y Soporte

¿Problemas o sugerencias? Crea un issue en GitHub o contacta al desarrollador.

---

¡Que disfrutes el juego! 🎮✨

