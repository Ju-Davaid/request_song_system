import express from 'express';
import ResponseViewObject from '../entity/vo/ResponseViewObject';
const requestSongRouter = express.Router();

requestSongRouter.post('/request_song', (req, res) => {
    const { song_name } = req.body;
    if (!song_name) {
        res.status(400).send('song_name is required');
        return;
    }
    res.status(200).send(ResponseViewObject.success({ song_name }));
});


export default requestSongRouter;
