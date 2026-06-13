import express from 'express';
import ResponseViewObject from '../entity/vo/ResponseViewObject';
import axios from 'axios';
const requestSongRouter = express.Router();

requestSongRouter.post('/request_song', (req, res) => {
    const { songName } = req.body;
    if (!songName) {
        res.status(400).send('songName is required');
        return;
    }
    res.status(200).send(ResponseViewObject.success({ songName }));
});
requestSongRouter.get('/userInfo', async (req, res) => {
    const { qq } = req.query
    if (!qq) {
        res.status(400).send(ResponseViewObject.error('qq is required'));
        return;
    }
    try {
        const userInfo = await axios.get(`https://uapis.cn/api/v1/social/qq/userinfo?qq=${qq}`)
        res.status(200).send(ResponseViewObject.success(userInfo.data));
    } catch (err) {
        console.error('获取用户信息失败:', err);
        res.status(500).send(ResponseViewObject.error('获取用户信息失败'));
        return;
    }
});

export default requestSongRouter;
