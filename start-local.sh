#!/bin/bash
set -e

# Kill any existing ngrok process
pkill ngrok 2>/dev/null || true
sleep 1

echo "Starting ngrok tunnel on port 8080..."
ngrok http 8080 --log=stdout > /tmp/ngrok-activepieces.log 2>&1 &
NGROK_PID=$!

# Wait for ngrok API to be ready
NGROK_URL=""
for i in $(seq 1 15); do
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | \
        python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    urls = [t['public_url'] for t in d.get('tunnels', []) if t['proto'] == 'https']
    print(urls[0] if urls else '')
except:
    print('')
" 2>/dev/null || echo "")
    [ -n "$NGROK_URL" ] && break
    echo "  Waiting... ($i/15)"
    sleep 1
done

if [ -z "$NGROK_URL" ]; then
    echo ""
    echo "ERROR: Could not get ngrok URL."
    echo "  - Make sure ngrok is installed: brew install ngrok"
    echo "  - Make sure ngrok is authenticated: ngrok config add-authtoken <token>"
    echo "  - Check logs: cat /tmp/ngrok-activepieces.log"
    kill $NGROK_PID 2>/dev/null || true
    exit 1
fi

echo ""
echo "Ngrok URL: $NGROK_URL"
echo ""

# Export so docker-compose picks it up (overrides .env value)
export AP_FRONTEND_URL="$NGROK_URL"

docker compose up -d

echo ""
echo "================================================"
echo "  Activepieces local:  http://localhost:8080"
echo "  Activepieces public: $NGROK_URL"
echo "  Ngrok dashboard:     http://localhost:4040"
echo "================================================"
echo ""
echo "Webhook URLs will use: $NGROK_URL"
echo "To stop: docker compose down && pkill ngrok"
