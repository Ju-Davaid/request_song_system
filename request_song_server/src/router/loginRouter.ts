import express from 'express';
import requestMusicServer from '../music/index';
import { Method } from 'axios';
import ResponseViewObject from '../entity/vo/ResponseViewObject';

const loginRouter = express.Router();

loginRouter.get('/getQQLoginQr', async (req, res) => {
    const data = await requestMusicServer(req.path, req.method as Method);
    res.status(200).json(data);
})
loginRouter.post('/checkQQLoginQr', async (req, res) => {
    const data = await requestMusicServer(req.path, req.method as Method, req.body);
    res.status(200).json(data);
})

loginRouter.get("/user/getUserPlaylists", async (req, res) => {
    // console.log(req.headers["x-custom-cookie"]);
    const { uin, offset, limit } = req.query
    if (!uin) {
        res.status(400).json(ResponseViewObject.error("uin is required"))
        return
    }
    const path = `${req.path}?uin=${uin}&offset=${offset}&limit=${limit}`
    const data = await requestMusicServer("/getMusicPlay?songmid=004FetLy2zme0O", req.method as Method, null, {
        headers: {
            "x-custom-cookie": req.headers["x-custom-cookie"],
        }
    });
    res.status(200).json(data);
})

export default loginRouter;
