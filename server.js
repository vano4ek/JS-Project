const server = require('./server/main');
const PORT = process.env.PORT || 8081;
server.startServer(PORT);