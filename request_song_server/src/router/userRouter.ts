import express from 'express';
import requestMusicServer from '../music/index';
import { Method } from 'axios';
import ResponseViewObject from '../entity/vo/ResponseViewObject';
import axios from 'axios';
import { MusicListDB } from '../database';
import { MusicVo } from '../entity/vo/MusicVo';

const userRouter = express.Router();

userRouter.get('/getQQLoginQr', async (req, res) => {
    const data = await requestMusicServer(req.path, req.method as Method);
    res.status(200).json(data);
})
userRouter.post('/checkQQLoginQr', async (req, res) => {
    const data = await requestMusicServer(req.path, req.method as Method, req.body);
    res.status(200).json(data);
})
userRouter.get('/userInfo', async (req, res) => {
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
userRouter.post("/addMusic", async (req, res) => {
    const { music } = req.body;
    if (!music) {
        res.status(400).send(ResponseViewObject.error('music is required'));
        return;
    }
    try {
        const { songmid } = music as MusicVo;
        const musicList = MusicListDB.getInstance();
        const targetMusic = await musicList.getMusicBySongmid(songmid);
        if (targetMusic) {
            res.status(400).send(ResponseViewObject.error('music already exists'));
            return;
        }
        await musicList.upsertMusic(music);
        res.status(200).json(ResponseViewObject.success(targetMusic));
    } catch (err) {
        console.error('添加歌曲失败:', err);
        res.status(500).send(ResponseViewObject.error('添加歌曲失败'));
    }
})
userRouter.get("/getMusicList", async (req, res) => {
    const musicList = await MusicListDB.getInstance().getAllMusic();
    res.status(200).json(ResponseViewObject.success(musicList));
})

export default userRouter;
