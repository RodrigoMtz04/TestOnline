# ✅ INSTALACIÓN Y VERIFICACIÓN

Esta guía verifica que tu instalación esté correcta y lista para usar.

---

## ✔️ Verificación Previa

### Paso 1: Verificar Node.js
```bash
node --version
# Debe mostrar v14+ (preferiblemente v18+)

npm --version
# Debe mostrar v6+
```

Si no tienes Node.js, descárgalo de https://nodejs.org/

### Paso 2: Verificar Proyecto
```bash
cd TestOnline
ls -la
```

Debe verse algo así:
```
server.js           # Servidor
public/index.html   # Juego
package.json        # Dependencias
vercel.json         # Config Vercel
QUICKSTART.md       # Guía rápida
... (más documentación)
```

---

## 📦 Instalación

### Paso 1: Instalar Dependencias
```bash
npm install
```

**Esperado:** Sin errores, ~122 packages instalados

**Si hay error:** 
- Intenta `npm install --legacy-peer-deps`
- O elimina `node_modules`: `rm -rf node_modules && npm install`

### Paso 2: Verificar Instalación
```bash
npm list
```

Deberías ver:
```
├── cors@2.8.x
├── dotenv@16.x.x
├── express@4.x.x
├── nodemon@2.x.x
└── socket.io@4.x.x
```

---

## 🚀 Ejecutar Localmente

### Paso 1: Iniciar Servidor
```bash
npm run dev
```

**Esperado:**
```
Servidor escuchando en puerto 3000
Entorno: development
```

**Si no aparece:**
- Verifica que el puerto 3000 está libre
- `lsof -i :3000` para ver qué lo usa
- Cambia PORT en .env si es necesario

### Paso 2: Abrir en Navegador
```
http://localhost:3000
```

**Esperado:**
- Ves la pantalla del lobby
- Puedes ingresar nombre y sala ID
- Botones "Unirse a Sala" y "Crear Nueva Sala" funcionan

### Paso 3: Probar Multijugador

**Opción A (Misma computadora):**
1. Abre http://localhost:3000 en la pestaña 1
2. Abre http://localhost:3000 en la pestaña 2
3. En ambas, usa `room_test` como ID
4. Ambos deberían verse el uno al otro

**Opción B (Red local):**
1. Obtén tu IP: `ipconfig getifaddr en0` (Mac) o `hostname -I` (Linux/WSL)
2. Otro en la red abre: `http://TU_IP:3000`
3. Usan la misma sala ID

---

## 🧪 Checklist de Verificación

### Servidor
- [ ] `npm install` completa sin errores
- [ ] `npm run dev` inicia sin errores
- [ ] Puerto 3000 está disponible
- [ ] Servidor muestra "Servidor escuchando en puerto 3000"

### Frontend
- [ ] http://localhost:3000 carga la página
- [ ] Ves el formulario del lobby
- [ ] Puedes escribir en los campos
- [ ] Los botones son clickeables

### Funcionalidad Básica
- [ ] Puedes unirte a una sala
- [ ] El juego carga y muestra el canvas
- [ ] Puedes moverte con WASD
- [ ] El mouse se ve en el juego
- [ ] Puedes disparar (click izquierdo)

### Multijugador
- [ ] Dos navegadores ven el mismo juego
- [ ] Los movimientos se sincronizan
- [ ] Los disparos aparecen en ambos
- [ ] La lista de jugadores actualiza

### Red Local
- [ ] Otro dispositivo puede conectarse
- [ ] Se ve el mismo juego en ambos
- [ ] La sincronización funciona

---

## 🔧 Solución de Problemas de Instalación

### "npm: command not found"
**Solución:** Instala Node.js desde https://nodejs.org/

### "ENOENT: no such file or directory"
**Solución:** 
```bash
cd /ruta/completa/a/TestOnline
npm install
```

### "Port 3000 already in use"
**Solución:**
```bash
# Opción 1: Mata el proceso
lsof -i :3000
kill -9 <PID>

# Opción 2: Usa otro puerto
PORT=3001 npm run dev
```

### "Cannot find module 'express'"
**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Socket.io cannot connect"
**Solución:**
1. Verifica que el servidor está corriendo
2. Recarga la página (F5)
3. Abre la consola (F12) para ver errores
4. Reinicia el servidor

---

## 📊 Verificación de Dependencias

```bash
npm audit
```

Si ves vulnerabilidades:
```bash
npm audit fix
# Si eso no funciona:
npm audit fix --force
```

---

## 🎯 Próximos Pasos

### Si todo funciona ✅
1. Lee [CONTROLES.md](CONTROLES.md) para aprender a jugar
2. Lee [ARQUITECTURA.md](ARQUITECTURA.md) para entender el código
3. Lee [DEPLOYMENT.md](DEPLOYMENT.md) para desplegar en Vercel

### Si hay problemas ❌
1. Revisa la sección "Solución de Problemas" arriba
2. Consulta [FAQ.md](FAQ.md)
3. Abre un issue en GitHub con los detalles

---

## 📋 Información del Entorno

Para compartir con soporte, proporciona:

```bash
node --version
npm --version
npm list express socket.io
```

**Ejemplos esperados:**
```
v18.12.0      # Node
9.2.0         # npm
express@4.18.2
socket.io@4.5.4
```

---

## 🚀 Desplegar en Vercel

Una vez que funciona localmente:

```bash
npm install -g vercel
vercel --prod
```

Lee [DEPLOYMENT.md](DEPLOYMENT.md) para instrucciones detalladas.

---

## ✨ Verificación Final

```bash
# Todas estas líneas deben ejecutarse sin error:
npm --version          # ✓ Muestra versión npm
npm install            # ✓ Instala/verifica dependencias
npm list               # ✓ Lista dependencias
npm run dev &          # ✓ Inicia servidor
sleep 2
curl http://localhost:3000  # ✓ Obtiene HTML
kill %1                # ✓ Para el servidor
```

Si todo sale bien, ¡estás listo para jugar! 🎮

---

## 📞 Soporte

- **Docs:** Ver [INDEX.md](INDEX.md)
- **Guía Rápida:** Ver [QUICKSTART.md](QUICKSTART.md)
- **Preguntas:** Ver [FAQ.md](FAQ.md)

---

¡Instalación completada exitosamente! 🎉

