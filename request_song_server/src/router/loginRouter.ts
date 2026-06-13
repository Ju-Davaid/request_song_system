import express from 'express';
import requestMusicServer from '../music/index';
import { Method } from 'axios';

const loginRouter = express.Router();

loginRouter.get('/getQQLoginQr', async (req, res) => {
    const data = await requestMusicServer(req.path, req.method as Method);
    res.status(200).json(data);
})
loginRouter.post('/checkQQLoginQr', async (req, res) => {
    const data = await requestMusicServer(req.path, req.method as Method, req.body);
    res.status(200).json(data);
})

export default loginRouter;
