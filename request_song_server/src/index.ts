import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 启动服务
app.listen(PORT, () => {
  console.log(`🚀 服务运行在 http://localhost:${PORT}`);
});