import express from 'express';
import requestMusicServer from '../music/index';
import { Method } from 'axios';
import ResponseViewObject from '../entity/vo/ResponseViewObject';
import axios from 'axios';
import { MusicListDB } from '../database';
import { MusicVo } from '../entity/vo/MusicVo';

const userRouter = express.Router();

// 获取QQ登录二维码
userRouter.get('/getQQLoginQr', async (req, res) => {
    const data = await requestMusicServer(req.path, req.method as Method);
    res.status(200).json(data);
})
// 检查QQ登录二维码
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
// 添加歌曲
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
// 获取歌曲列表
userRouter.get("/getMusicList", async (req, res) => {
    try {
        const musicList = (await MusicListDB.getInstance().getAllMusic())
        const parsedMusicList = musicList.map((item) => ({
            ...item.dataValues,
        }));
        res.status(200).json(ResponseViewObject.success(parsedMusicList));
    } catch (err) {
        console.error('获取歌曲列表失败:', err);
        res.status(500).send(ResponseViewObject.error('获取歌曲列表失败'));
    }
})
// 删除歌曲
userRouter.post("/deleteMusic", async (req, res) => {
    const { songmid } = req.body;
    if (!songmid) {
        res.status(400).send(ResponseViewObject.error('songmid is required'));
        return;
    }
    try {
        const musicList = MusicListDB.getInstance();
        const result = await musicList.deleteMusic(songmid);
        res.status(200).json(ResponseViewObject.success(result));
    } catch (err) {
        console.error('删除歌曲失败:', err);
        res.status(500).send(ResponseViewObject.error('删除歌曲失败'));
    }
})
// 清空歌曲
userRouter.post("/clearMusic", async (req, res) => {
    try {
        const musicList = MusicListDB.getInstance();
        await musicList.clearAll();
        res.status(200).json(ResponseViewObject.success(null));
    } catch (err) {
        console.error('清空歌曲失败:', err);
        res.status(500).send(ResponseViewObject.error('清空歌曲失败'));
    }
})

userRouter.get("/deleteMusic", async (req, res) => {
    const { songmid } = req.query;
    if (!songmid) {
        res.status(400).send(ResponseViewObject.error('songmid is required'));
        return;
    }
    try {
        const musicList = MusicListDB.getInstance();
        await musicList.deleteMusic(songmid as string);
        res.status(200).json(ResponseViewObject.success(null));
    } catch (err) {
        console.error('删除歌曲失败:', err);
        res.status(500).send(ResponseViewObject.error('删除歌曲失败'));
    }
})

export default userRouter;
