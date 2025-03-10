const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 5001 });

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  console.log("Новый клиент подключен");

  ws.on("message", (message) => {
    console.log("Получено сообщение:", message);

    // Отправляем сообщение всем клиентам
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
    console.log("Клиент отключился");
  });
});

console.log("WebSocket сервер запущен на ws://localhost:5000");
