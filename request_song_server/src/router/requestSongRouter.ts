import express from 'express';
import ResponseViewObject from '../entity/vo/ResponseViewObject';
const requestSongRouter = express.Router();

requestSongRouter.post('/request_song', (req, res) => {
    const { songName } = req.body;
    if (!songName) {
        res.status(400).send('songName is required');
        return;
    }
    res.status(200).send(ResponseViewObject.success({ songName }));
});


export default requestSongRouter;
