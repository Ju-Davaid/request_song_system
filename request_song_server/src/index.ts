import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { spawn } from 'child_process';
import path from 'path';
import requestSongRouter from './router/requestSongRouter';
// console.log("qq-music-api:",a)

// 加载环境变量
dotenv.config();
// 音乐API端口
const musicApiPort = process.env.MUSIC_API_PORT ?? '3200';

//  接入QQ音乐API
const qqMusicPath = path.join(__dirname, '../', 'node_modules', '@sansenjian/qq-music-api', 'dist', 'app.js');
const musicApiProcess = spawn('node', [qqMusicPath], {
  env: { PORT: musicApiPort },
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
const PORT = process.env.PORT ?? 3000;
const IP = process.env.IP ?? '127.0.0.1';

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
  console.log(`Music API is running on http://${IP}:${musicApiPort}`);
});