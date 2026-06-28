import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import initSocketServer from './socket';
import http from 'http';
dotenv.config();
import musicRouter from './router/musicRouter';
import userRouter from './router/userRouter';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT ?? 3000;
const IP = process.env.IP ?? '127.0.0.1';

initSocketServer(server);

app.use(cors());
app.use(express.json());

const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath, {
  maxAge: '7d'
}));

app.use('/api', [musicRouter, userRouter]);

app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://${IP}:${PORT}`);
});