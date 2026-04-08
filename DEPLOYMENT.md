# Guía Detallada de Despliegue en Vercel

## ¿Por qué Vercel?

Vercel es ideal para este proyecto porque:
- Soporta Node.js y Express
- Despliegue automático desde GitHub
- Dominio gratis (.vercel.app)
- SSL/TLS incluido
- Escalabilidad automática

## Pasos de Despliegue

### Fase 1: Preparación Local

#### 1.1 Verificar que todo funciona localmente

```bash
npm install
npm run dev
```

Abre http://localhost:3000 en el navegador y verifica que el juego funciona.

#### 1.2 Hacer commit de cambios

```bash
git add .
git commit -m "Initial commit: Shooter multiplayer game"
```

### Fase 2: Configurar Repositorio en GitHub

#### 2.1 Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Crea un repositorio llamado `shooter-multiplayer` (o el nombre que prefieras)
3. NO inicialices con README (ya tienes uno)

#### 2.2 Conectar repositorio local a GitHub

```bash
# Reemplaza <TU_USUARIO> con tu usuario de GitHub
git remote add origin https://github.com/<TU_USUARIO>/shooter-multiplayer.git
git branch -M main
git push -u origin main
```

### Fase 3: Desplegar en Vercel

#### Opción A: Via Web Interface (Recomendado para principiantes)

1. Ve a https://vercel.com
2. Haz clic en "Sign Up" o "Log In"
3. Elige "GitHub" como método de autenticación
4. Autoriza Vercel a acceder a tus repositorios
5. Haz clic en "Import Project"
6. Selecciona `shooter-multiplayer`
7. En "Build & Output Settings":
   - Framework Preset: `Other`
   - Build Command: (dejar vacío)
   - Output Directory: (dejar vacío)
8. Haz clic en "Deploy"

#### Opción B: Via Vercel CLI (Para usuarios avanzados)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel
```

Sigue las instrucciones interactivas.

### Fase 4: Configuración Post-Despliegue

#### 4.1 Verificar despliegue

Vercel te proporcionará una URL como `https://shooter-multiplayer.vercel.app`

Accede a ella y verifica que el juego funciona correctamente.

#### 4.2 Variables de Entorno (Opcional)

Si necesitas agregar variables de entorno en producción:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las variables necesarias

**Ejemplo:**
- Key: `PORT`
- Value: `3000`

#### 4.3 Dominios Personalizados (Opcional)

1. En Vercel, Settings → Domains
2. Agrega tu dominio personalizado
3. Configura los registros DNS en tu proveedor de dominios

## Solución de Problemas en Producción

### El juego no se carga

**Verificar:**
1. Consulta los logs en Vercel (Project → Deployments → Click → Logs)
2. Abre la consola del navegador (F12) para errores
3. Verifica que Socket.io se conecta correctamente

**Soluciones:**
```javascript
// En public/index.html, agrega esto para debuggear
const socket = io({
  path: '/socket.io/',
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
```

### WebSocket no funciona

Esto puede ocurrir si Vercel requiere configuración especial. En ese caso:

1. Actualiza `server.js` para usar polling como fallback:

```javascript
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'] // Agrega polling como fallback
});
```

2. Re-despliega: `git push` (si usas GitHub)

### El servidor se congela después de algunos minutos

Vercel tiene un timeout de 30 segundos para funciones serverless. Para mantener el servidor vivo:

```javascript
// Agregar en server.js
setInterval(() => {
  console.log('Keep-alive ping');
}, 25000);
```

## Mejoras para Producción

### 1. Usar Base de Datos para Persistencia

Para mantener salas después de reinicios, usa Upstash Redis:

```bash
npm install redis
```

```javascript
// Agregar en server.js
import redis from 'redis';

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

// Guardar salas en Redis
await redisClient.set(`room:${roomId}`, JSON.stringify(room.players));
```

Agrega `REDIS_URL` en Vercel Environment Variables.

### 2. Logs Centralizados

Para mejor debugging:

```bash
npm install winston
```

### 3. Monitoreo

Usa Vercel Analytics:

1. Ve a Project Settings
2. Enable Analytics
3. Visualiza métricas en tiempo real

## Actualizar el Juego en Producción

Una vez desplegado, actualizar es simple:

```bash
# Hacer cambios locales
# ...

# Commit y push
git add .
git commit -m "Mejoras al juego"
git push origin main
```

**Vercel automáticamente:**
1. Detecta el push
2. Ejecuta build
3. Despliega la nueva versión

## Datos Útiles

| Recurso | URL |
|---------|-----|
| Dashboard de Vercel | https://vercel.com/dashboard |
| Logs del Proyecto | https://vercel.com/dashboard/[proyecto]/logs |
| Status de Vercel | https://status.vercel.com |

## Soporte

Si tienes problemas:

1. Consulta https://vercel.com/docs
2. Ve a https://vercel.com/support
3. Abre un issue en GitHub

---

¡Listo! Tu juego debería estar viviendo en Vercel. 🚀

