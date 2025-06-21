require('dotenv').config();
// const port = process.env.PORT || 5000;
const port = 3000;
const app = require('./app');
const http = require('http');
const WebSocket = require('ws');

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server on /ws
const wss = new WebSocket.Server({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  ws.send(JSON.stringify({ message : 'WebSocket connection established!'}));

  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    // Echo the message back
    ws.send(JSON.stringify({message :`Server received: ${message}`}));
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Start HTTP+WebSocket server
server.listen(port, () => console.log(`Listening to port ${port}`));
