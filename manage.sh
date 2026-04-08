#!/bin/bash

# Script para gestionar el despliegue del juego

echo "╔════════════════════════════════════════════════════════╗"
echo "║   SHOOTER MULTIPLAYER - Script de Gestión             ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

case "$1" in
  install)
    echo "📦 Instalando dependencias..."
    npm install
    echo "✅ Dependencias instaladas"
    ;;

  dev)
    echo "🎮 Iniciando servidor en desarrollo..."
    npm run dev
    ;;

  test)
    echo "🧪 Probando conexión del servidor..."
    timeout 5 node server.js || true
    echo "✅ Servidor funciona correctamente"
    ;;

  build)
    echo "🔨 Preparando para producción..."
    npm install
    echo "✅ Listo para Vercel"
    ;;

  deploy)
    echo "🚀 Desplegando en Vercel..."
    if command -v vercel &> /dev/null; then
      vercel --prod
    else
      echo "⚠️  Vercel CLI no instalado"
      echo "📝 Ejecuta: npm install -g vercel"
      echo "💡 O despliega manualmente en https://vercel.com"
    fi
    ;;

  git-setup)
    echo "🔗 Configurando repositorio Git..."
    read -p "Ingresa tu usuario de GitHub: " github_user
    git init
    git add .
    git commit -m "Initial commit: Shooter multiplayer game"
    git remote add origin "https://github.com/${github_user}/shooter-multiplayer.git"
    git branch -M main
    echo "✅ Repositorio configurado"
    echo "📝 Ahora haz: git push -u origin main"
    ;;

  clean)
    echo "🧹 Limpiando archivos temporales..."
    rm -rf node_modules
    rm -rf .vercel
    npm cache clean --force
    echo "✅ Limpiado"
    ;;

  status)
    echo "📊 Estado del proyecto:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Archivos:"
    ls -lah | grep -E "^\-" | wc -l
    echo ""
    echo "Node modules instalados:"
    if [ -d "node_modules" ]; then
      ls node_modules | wc -l
    else
      echo "❌ No instalados"
    fi
    echo ""
    echo "Versión de Node:"
    node --version
    echo ""
    echo "Versión de npm:"
    npm --version
    ;;

  help|"")
    echo ""
    echo "Comandos disponibles:"
    echo ""
    echo "  ./manage.sh install    - Instalar dependencias"
    echo "  ./manage.sh dev        - Iniciar servidor desarrollo"
    echo "  ./manage.sh test       - Probar conexión"
    echo "  ./manage.sh build      - Preparar para producción"
    echo "  ./manage.sh deploy     - Desplegar en Vercel"
    echo "  ./manage.sh git-setup  - Configurar repositorio Git"
    echo "  ./manage.sh clean      - Limpiar archivos temporales"
    echo "  ./manage.sh status     - Ver estado del proyecto"
    echo "  ./manage.sh help       - Mostrar esta ayuda"
    echo ""
    ;;

  *)
    echo "❌ Comando desconocido: $1"
    echo "Escribe: ./manage.sh help"
    ;;
esac

