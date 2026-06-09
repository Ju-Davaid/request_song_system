import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import requestSongRouter from './router/requestSongRouter';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;
const IP = process.env.IP ?? '127.0.0.1';
const MUSIC_API_PORT = process.env.MUSIC_API_PORT ?? 3200;

// 中间件
app.use(cors());
app.use(express.json());
// 静态文件服务
app.use(express.static('public'));

// 挂载请求歌曲路由
app.use('/api', requestSongRouter);

// 启动服务
app.listen(PORT, () => {
  console.log(`Server is running on http://${IP}:${PORT}`);
});