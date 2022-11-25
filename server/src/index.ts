Bun.serve({
  websocket: {
    open(ws) {
      ws.send("Hello world!");
    },
    message(ws, message) {
      
    }
  },
  fetch(request, server) {
    if (server.upgrade(request)) return;

    return new Response("Http");
  },
});
