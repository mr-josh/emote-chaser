let players = {};

Bun.serve({
  websocket: {
    open(ws) {
      ws.send("Hello world!");

      // Send the world physics state to the client 
      setInterval(() => {
        ws.send("Ping");
      }, 14);
    },
    message(ws, message) {
      // Get the client's input and update the world physics
    }
  },
  fetch(request, server) {
    if (server.upgrade(request)) return;

    return new Response("Http");
  },
});
