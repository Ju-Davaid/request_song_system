import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;
const IP = process.env.IP ?? '127.0.0.1';

// 中间件
app.use(cors());
app.use(express.json());

// 启动服务
app.listen(PORT, () => {
  console.log(`Server is running on http://${IP}:${PORT}`);
});