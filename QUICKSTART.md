# 🚀 Guía de Inicio Rápido

Sigue estos pasos para tener el juego corriendo en **2 minutos**.

---

## 1️⃣ Descargar el Proyecto

```bash
# Clonar o descargar el repositorio
git clone https://github.com/tu-usuario/shooter-multiplayer.git
cd shooter-multiplayer
```

---

## 2️⃣ Instalar Dependencias

```bash
npm install
```

Esto instalará:
- Express (servidor web)
- Socket.io (comunicación en tiempo real)
- CORS (manejo de peticiones)
- dotenv (variables de entorno)

---

## 3️⃣ Ejecutar Localmente

```bash
npm run dev
```

Verás algo como:
```
Servidor escuchando en puerto 3000
Entorno: development
```

---

## 4️⃣ Abrir el Juego

Abre tu navegador y ve a:
```
http://localhost:3000
```

---

## 5️⃣ Jugar

### En una sola computadora (para probar):
1. Abre http://localhost:3000 en una pestaña
2. Abre http://localhost:3000 en otra pestaña
3. En ambas:
   - Ingresa tu nombre (ej: "Jugador 1", "Jugador 2")
   - Usa la misma sala ID (ej: "room_test")
   - Haz clic "Unirse a Sala"
4. Ahora ambas ventanas estarán conectadas
5. Controles:
   - **WASD** para moverte
   - **Mouse** para apuntar
   - **Click** para disparar

### Con otros en la red:
1. Obtén tu IP local: `ipconfig getifaddr en0` (Mac) o `hostname -I` (Linux)
2. Los otros conectan a: `http://TU_IP:3000`
3. Usan la misma sala ID para conectarse

---

## ⏰ Parar el Servidor

Presiona `Ctrl+C` en la terminal

---

## 🎮 Próximo Paso: Desplegar en Vercel

Una vez que funciona localmente, despliégalo en Vercel:

```bash
npm install -g vercel
vercel
```

O sigue la guía en **DEPLOYMENT.md**

---

## 🆘 Problemas?

| Problema | Solución |
|----------|----------|
| Puerto 3000 en uso | `lsof -i :3000` y mata el proceso |
| "npm not found" | Instala Node.js desde nodejs.org |
| No veo otros jugadores | Usa la **misma sala ID** |
| Error de Socket.io | Recarga la página (F5) |

---

## 📁 Estructura Básica

```
├── public/index.html     ← El juego
├── server.js             ← Lógica del servidor
└── package.json          ← Dependencias
```

---

## 📚 Documentación Completa

- **README.md** - Información general
- **CONTROLES.md** - Cómo jugar
- **DEPLOYMENT.md** - Desplegar en Vercel
- **ARQUITECTURA.md** - Cómo funciona técnicamente
- **EJEMPLOS.md** - Cómo agregar características
- **FAQ.md** - Preguntas frecuentes
- **ROADMAP.md** - Características futuras

---

## 💡 Tips

✅ **Primer juego:** Abre 2 pestañas en tu PC
✅ **Red local:** Otros en la misma WiFi pueden conectarse
✅ **En internet:** Despliega en Vercel para URL pública
✅ **Agregar features:** Consulta EJEMPLOS.md

---

¡Listo! Ahora **abre http://localhost:3000** y ¡que disfrutes! 🎮✨

