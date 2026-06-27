import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { spawn } from 'child_process';
import path from 'path';
import initSocketServer from './socket';
import http from 'http';
// 加载环境变量
dotenv.config();
import musicRouter from './router/musicRouter';
import userRouter from './router/userRouter';
// 音乐API端口
const musicApiPort = process.env.MUSIC_API_PORT ?? '3001';

//  接入QQ音乐API
const qqMusicPath = path.join(__dirname, '../', 'node_modules', '@sansenjian/qq-music-api', 'dist', 'app.js');
const musicApiIP = process.env.MUSIC_API_IP ?? '127.0.0.1';
const musicApiProcess = spawn('node', [qqMusicPath], {
  env: { PORT: musicApiPort, IP: musicApiIP },
  stdio: 'inherit',
});

// 监听音乐API进程退出事件
musicApiProcess.on('exit', (code) => {
  console.log(`Music API process exited with code ${code}`);
});
// 监听音乐API进程错误事件
musicApiProcess.on('error', (err) => {
  console.error(`Music API process error: ${err}`);
});

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT ?? 3000;
const IP = process.env.IP ?? '127.0.0.1';

// 初始化Socket服务器
initSocketServer(server);



// 中间件
app.use(cors());
app.use(express.json());

const staticPath = path.join(__dirname, '../public');
// 静态文件服务
app.use(express.static(staticPath, {
  maxAge: '7d'
}));

// 挂载请求歌曲路由
app.use('/api', [musicRouter, userRouter]);

// 所有未匹配的路由，统一返回 index.html
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// 启动服务
server.listen(PORT, () => {
  console.log(`Server is running on http://${IP}:${PORT}`);
  console.log(`Music API is running on http://${IP}:${musicApiPort}`);
});