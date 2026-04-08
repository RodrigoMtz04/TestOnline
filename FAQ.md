# Preguntas Frecuentes (FAQ)

## 🎮 Sobre el Juego

### P: ¿Cuántos jugadores pueden jugar en una sala?
**R:** Actualmente se soportan 8-10 jugadores por sala de forma óptima. El servidor puede mantener salas de más jugadores, pero la sincronización puede volverse lenta.

### P: ¿Hay límite de salas?
**R:** No hay límite técnico, pero cada sala consume memoria del servidor. En Vercel con 1GB de RAM se pueden mantener ~100 salas activas.

### P: ¿Las salas se guardan?
**R:** No, las salas son temporales. Se crean cuando el primer jugador se une y se eliminan cuando el último se va. Los datos se pierden al reiniciar el servidor.

### P: ¿Cómo puedo guardar partidas?
**R:** Requiere agregar una base de datos. Ver sección "Mejoras Futuras" en DEPLOYMENT.md

### P: ¿Puedo jugar sin internet?
**R:** No, es un juego multijugador que requiere conexión a internet constante.

---

## 🚀 Despliegue

### P: ¿Cuánto cuesta desplegar en Vercel?
**R:** El plan gratuito es suficiente para comenzar. Vercel cobra por uso excesivo (>100 horas/mes).

### P: ¿Puedo desplegar en otro servidor?
**R:** Sí, puedes usar Heroku, Railway, AWS, o cualquier servidor Node.js. El código es agnóstico.

### P: ¿Necesito un dominio personalizado?
**R:** No es obligatorio. Vercel proporciona un subdominio gratis como `tu-proyecto.vercel.app`.

### P: ¿Mi juego será público?
**R:** Sí, cualquiera con la URL puede acceder. Si quieres privacidad, implementa autenticación.

### P: ¿Qué sucede si excedo los límites de Vercel?
**R:** Tu función se pausará temporalmente. Puedes suscribirse a un plan pagado para más recursos.

---

## 🛠️ Técnico

### P: ¿Qué versión de Node se requiere?
**R:** Node 14+, pero se recomienda 18+. Vercel usa 18.x por defecto.

### P: ¿Socket.io es obligatorio?
**R:** No, puedes reemplazarlo con otras librerías como ws, signalr, etc. Pero requiere cambios en el código.

### P: ¿Por qué Socket.io y no WebSocket puro?
**R:** Socket.io es más robusto, maneja fallbacks a polling, reconexión automática y es compatible con más navegadores.

### P: ¿Puedo usar una base de datos?
**R:** Sí. Requiere instalar un cliente (redis, mongoose, sqlite, etc.) y cambiar el código del servidor.

### P: ¿Cómo agrego autenticación?
**R:** Puedes usar JWT, OAuth de Google/GitHub, o crear un sistema simple de login. Requiere modificar server.js e index.html.

---

## 🎨 Personalización

### P: ¿Cómo cambio los colores?
**R:** En `public/index.html`, busca los valores hex de color (ej: `0x00ff00`) y cámbia los números.

### P: ¿Cómo agrego sonidos?
**R:** Phaser soporta audio. Agregua archivos de sonido a `/public` y carga con `this.sound.add()`.

### P: ¿Cómo agrego músicas?
**R:** Similar a sonidos. En `create()` del juego: `this.sound.play('musica', { loop: true })`.

### P: ¿Puedo cambiar el tamaño del mapa?
**R:** Sí, en `public/index.html` modifica `window.innerWidth` y `window.innerHeight`, o configura tamaños fijos.

### P: ¿Cómo agrego items/power-ups?
**R:** Requiere crear sprites nuevos, lógica de colisión y broadcast de eventos. Ver ARQUITECTURA.md para la estructura.

---

## 🐛 Solución de Problemas

### P: El juego no carga, ¿qué hago?
**R:** 
1. Abre DevTools (F12)
2. Revisa la pestaña Console para errores
3. Verifica que el servidor esté corriendo
4. Intenta http://localhost:3000 en desarrollo

### P: Otros jugadores no aparecen
**R:**
1. Verifica que usan la misma sala ID
2. Revisa la consola para errores de Socket.io
3. Intenta descargar el navegador
4. Verifica tu firewall

### P: El juego se ve muy lento
**R:**
1. Cierra otras aplicaciones
2. Verifica tu conexión a internet
3. Cambia a una zona con menos latencia
4. Reduce la resolución del navegador

### P: Socket.io error "Cannot GET /socket.io/"
**R:** El servidor Socket.io no está funcionando. Verifica que `server.js` esté corriendo en el puerto correcto.

### P: Error "Maximum call stack exceeded"
**R:** Típicamente causado por emisión recursiva de eventos. Revisa la lógica de sincronización.

---

## 💰 Costos

### P: ¿Cuál es el costo total de operación?
**R:** 
- Vercel: Gratis-$20/mes
- Dominio (opcional): $10-15/año
- Base de datos (opcional): $5-50/mes
- Total mínimo: Gratis

### P: ¿Puedo monetizar el juego?
**R:** Sí, pero respeta los términos de servicio de Vercel. Opciones: ads, sistema de batalla pass, cosmétique, etc.

### P: ¿Necesito seguros/licencias?
**R:** Depende de tu jurisdicción. Consulta a un abogado si ofreces compras in-app.

---

## 🔮 Futuro

### P: ¿Cuáles son las características planificadas?
**R:** Ver lista en README.md. Incluye: equipos, armas, mapas, ranking, chat, etc.

### P: ¿Puedo contribuir código?
**R:** Este es un proyecto educativo. Fork el repositorio en GitHub y haz pull requests.

### P: ¿Hay roadmap público?
**R:** No hay roadmap oficial, pero las mejoras se planifican basadas en feedback de usuarios.

---

## 📞 Soporte

### P: ¿Dónde reporto bugs?
**R:** Abre un issue en GitHub con descripción del problema, pasos a reproducir y capturas de pantalla.

### P: ¿Hay Discord o comunidad?
**R:** No hay comunidad oficial aún. Puedes crear un servidor de Discord para tu grupo de amigos.

### P: ¿Puedo contactar al desarrollador?
**R:** Sí, a través de GitHub Issues o el perfil del desarrollador.

---

## 📚 Recursos

| Recurso | URL |
|---------|-----|
| Documentación Phaser | https://photonstorm.github.io/phaser3-docs/ |
| Documentación Socket.io | https://socket.io/docs/ |
| Documentación Vercel | https://vercel.com/docs |
| MDN Web Docs | https://developer.mozilla.org/es/ |

---

¿No encontraste tu respuesta? Abre un issue o consulta la documentación en el repositorio. 🤔

