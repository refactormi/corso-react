#!/bin/bash

# Script di utilità per la gestione del progetto React con Vite
# Questo file contiene comandi utili per lo sviluppo quotidiano

echo "🚀 Script di Utilità per Progetto React + Vite"
echo "=============================================="

# Funzione per mostrare l'help
show_help() {
    echo ""
    echo "Comandi disponibili:"
    echo "  dev          - Avvia il server di sviluppo"
    echo "  dev-host     - Avvia con accesso di rete"
    echo "  dev-port     - Avvia su porta specifica"
    echo "  build        - Build per produzione"
    echo "  preview      - Preview del build"
    echo "  lint         - Esegue il linting"
    echo "  clean        - Pulisce cache e node_modules"
    echo "  install      - Installa dipendenze"
    echo "  update       - Aggiorna dipendenze"
    echo "  check        - Verifica installazione"
    echo "  kill         - Termina processi Vite"
    echo "  help         - Mostra questo help"
    echo ""
}

# Funzione per avviare il server di sviluppo
start_dev() {
    echo "🔥 Avvio server di sviluppo..."
    npm run dev
}

# Funzione per avviare con accesso di rete
start_dev_host() {
    echo "🌐 Avvio server con accesso di rete..."
    npm run dev -- --host
}

# Funzione per avviare su porta specifica
start_dev_port() {
    read -p "Inserisci la porta (default: 3000): " port
    port=${port:-3000}
    echo "🔌 Avvio server su porta $port..."
    npm run dev -- --port $port
}

# Funzione per build di produzione
build_production() {
    echo "🏗️  Build per produzione..."
    npm run build
    echo "✅ Build completato!"
}

# Funzione per preview del build
preview_build() {
    echo "👀 Preview del build..."
    npm run preview
}

# Funzione per linting
run_lint() {
    echo "🔍 Esecuzione linting..."
    npm run lint
}

# Funzione per pulizia
clean_project() {
    echo "🧹 Pulizia progetto..."
    echo "Rimozione node_modules..."
    rm -rf node_modules
    echo "Rimozione package-lock.json..."
    rm -f package-lock.json
    echo "Pulizia cache npm..."
    npm cache clean --force
    echo "✅ Pulizia completata!"
}

# Funzione per installazione dipendenze
install_deps() {
    echo "📦 Installazione dipendenze..."
    npm install
    echo "✅ Dipendenze installate!"
}

# Funzione per aggiornamento dipendenze
update_deps() {
    echo "🔄 Controllo dipendenze obsolete..."
    npm outdated
    echo ""
    read -p "Vuoi aggiornare le dipendenze? (y/n): " update
    if [[ $update == "y" || $update == "Y" ]]; then
        npm update
        echo "✅ Dipendenze aggiornate!"
    fi
}

# Funzione per verifica installazione
check_installation() {
    echo "🔍 Verifica installazione..."
    echo ""
    echo "Node.js:"
    node --version
    echo ""
    echo "npm:"
    npm --version
    echo ""
    echo "Vite:"
    npx vite --version
    echo ""
    echo "React:"
    npm list react
    echo ""
    echo "✅ Verifica completata!"
}

# Funzione per terminare processi Vite
kill_vite() {
    echo "💀 Terminazione processi Vite..."
    
    # Trova processi Vite
    vite_pids=$(ps aux | grep vite | grep -v grep | awk '{print $2}')
    
    if [ -z "$vite_pids" ]; then
        echo "Nessun processo Vite trovato."
    else
        echo "Processi Vite trovati: $vite_pids"
        echo "$vite_pids" | xargs kill -9
        echo "✅ Processi Vite terminati!"
    fi
}

# Funzione per avviare con HTTPS
start_dev_https() {
    echo "🔒 Avvio server con HTTPS..."
    npm run dev -- --https
}

# Funzione per build con analisi
build_analyze() {
    echo "📊 Build con analisi del bundle..."
    npm run build -- --analyze
}

# Funzione per avviare con modalità watch
build_watch() {
    echo "👀 Build con modalità watch..."
    npm run build -- --watch
}

# Menu principale
case "$1" in
    "dev")
        start_dev
        ;;
    "dev-host")
        start_dev_host
        ;;
    "dev-port")
        start_dev_port
        ;;
    "dev-https")
        start_dev_https
        ;;
    "build")
        build_production
        ;;
    "build-analyze")
        build_analyze
        ;;
    "build-watch")
        build_watch
        ;;
    "preview")
        preview_build
        ;;
    "lint")
        run_lint
        ;;
    "clean")
        clean_project
        ;;
    "install")
        install_deps
        ;;
    "update")
        update_deps
        ;;
    "check")
        check_installation
        ;;
    "kill")
        kill_vite
        ;;
    "help"|"")
        show_help
        ;;
    *)
        echo "❌ Comando non riconosciuto: $1"
        show_help
        ;;
esac
