import express from 'express';
import ResponseViewObject from '../entity/vo/ResponseViewObject';
import axios from 'axios';
const musicRouter = express.Router();
import requestMusicServer from '../music/index';
import { Method } from 'axios';
import { similarAlgorithm } from '../utils/similarAlgorithm';
import { MusicVo, SearchVo } from '../entity/vo/MusicVo';

musicRouter.post('/request_song', (req, res) => {
    const { songName } = req.body;
    if (!songName) {
        res.status(400).send('songName is required');
        return;
    }
    res.status(200).send(ResponseViewObject.success({ songName }));
});
musicRouter.get("/getMusicUrl", async (req, res) => {
    // console.log(req.headers["x-custom-cookie"]);
    const { songmid } = req.query
    if (!songmid) {
        res.status(400).json(ResponseViewObject.error("songmid is required"))
        return
    }
    try {
        let url: string = (await requestMusicServer(`/getMusicPlay?songmid=${songmid}`, req.method as Method, null, {
            headers: {
                "x-custom-cookie": req.headers["x-custom-cookie"],
            }
        })).getData().data.playUrl[songmid as string].url;
        if (url.trim().length === 0) {
            let res = await axios.get(`https://api.vkeys.cn/v2/music/tencent/geturl?mid=${songmid}`)
            url = res.data.data.url;
        }
        res.status(200).json(ResponseViewObject.success({url}));
    } catch (err) {
        res.status(500).json(ResponseViewObject.error("get music play url failed"))
    }
})

musicRouter.get("/getMusicInfo", async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        res.status(400).json(ResponseViewObject.error("keyword is required"))
        return
    }
    try {
        const searchRes: any = await requestMusicServer(`/getSearchByKey?key=${keyword}&limit=20`, "GET")
        const songList: any[] = searchRes.data.response.data.song.list;
        if (songList.length === 0) {
            res.status(404).json(ResponseViewObject.error("song not found"))
            return
        }

        // 获取歌曲封面信息
        const songInfoList = (await axios.get(`https://ffapi.cn/int/v1/dg_qqmusic?msg=${keyword}&limit=20&format=json&n=`)).data.data;

        // 计算每首歌曲与 keyword 的相似度，并添加到歌曲信息中
        const songsWithSimilarity = songList.map<MusicVo>((item) => {
            const name = item.songname;
            const singer = item.singer[0].name;
            const cover = songInfoList.find((info: any) => info.title.includes(name) && info.singer.includes(singer))?.pic ?? "";
            const duration = item.interval;
            // 计算相似度（综合歌名和歌手名）
            const nameSimilarity = similarAlgorithm(name, keyword as string);
            const singerSimilarity = similarAlgorithm(singer, keyword as string);
            // 综合相似度：歌名权重0.7，歌手名权重0.3
            const similarity = Number(((nameSimilarity * 0.7 + singerSimilarity * 0.3)).toFixed(4));

            return {
                name,
                singer,
                songmid: item.songmid,
                duration,
                cover,
                similarity,
            };
        });

        // 按相似度降序排序
        songsWithSimilarity.sort((a, b) => b.similarity - a.similarity);
        const topMatch = songsWithSimilarity[0];
        topMatch.vip = false;
        let url: string = (await requestMusicServer(`/getMusicPlay?songmid=${topMatch.songmid}`, "GET")).getData().data.playUrl[topMatch.songmid].url;
        if (url.trim().length === 0) {
            topMatch.vip = true;
            let res = await axios.get(`https://api.vkeys.cn/v2/music/tencent/geturl?mid=${topMatch.songmid}`)
            url = res.data.data.url;
            if (topMatch.cover?.trim().length === 0) {
                topMatch.cover = res.data.data.cover;
            }
        }
        let lyric = (await requestMusicServer(`/getLyric?songmid=${topMatch.songmid}&isFormat=1`, "GET")).getData().response.lyric.lines
        if (!lyric) {
            await axios.get(`https://api.vkeys.cn/v2/music/tencent/geturl?mid=${topMatch.songmid}`)
        }
        topMatch.lyric = lyric
        res.status(200).json(ResponseViewObject.success({
            url,
            ...topMatch,
        }));
    } catch (err: any) {
        res.status(500).json(ResponseViewObject.error(err.message));
    }
})

musicRouter.get("/search", async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        res.status(200).json(ResponseViewObject.success([]))
        return
    }
    try {
        const searchRes: any = await requestMusicServer(`/getSearchByKey?key=${keyword}&limit=10&catZhida=1`, "GET")
        const songList: any[] = searchRes.data.response.data.song.list;
        if (songList.length === 0) {
            res.status(200).json(ResponseViewObject.success([]))
            return
        }
        const songInfoList = (await axios.get(`https://ffapi.cn/int/v1/dg_qqmusic?msg=${keyword}&limit=20&format=json&n=`)).data.data;
        const songsWithSimilarity = songList.map<Promise<SearchVo>>((item) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const name = item.songname;
                    const singer = item.singer[0].name;
                    const cover = songInfoList.find((info: any) => info.title.includes(name) && info.singer.includes(singer))?.pic ?? "";
                    const duration = item.interval;
                    // 计算相似度（综合歌名和歌手名）
                    const nameSimilarity = similarAlgorithm(name, keyword as string);
                    const singerSimilarity = similarAlgorithm(singer, keyword as string);
                    // 综合相似度：歌名权重0.7，歌手名权重0.3
                    const similarity = Number(((nameSimilarity * 0.7 + singerSimilarity * 0.3)).toFixed(4));
                    item.vip = false;
                    let lyric = (await requestMusicServer(`/getLyric?songmid=${item.songmid}&isFormat=1`, "GET")).getData().response.lyric.lines
                    if (!lyric) {
                        lyric = await axios.get(`https://api.vkeys.cn/v2/music/tencent/geturl?mid=${item.songmid}`)
                        lyric = lyric.data.data.lyric;
                    }
                    const highlightName = name.replace(keyword as string, `<span style="color: red;">${keyword}</span>`);
                    const highlightSinger = singer.replace(keyword as string, `<span style="color: red;">${keyword}</span>`);
                    resolve({
                        name,
                        highlight: {
                            name: highlightName,
                            singer: highlightSinger,
                        },
                        lyric,
                        vip: item.vip,
                        singer,
                        songmid: item.songmid,
                        duration,
                        cover,
                        similarity,
                    })
                } catch (err) {
                    reject(err)
                }
            })
        });
        const songs = await Promise.all(songsWithSimilarity);

        res.status(200).json(ResponseViewObject.success(songs));
    } catch (err: any) {
        res.status(500).json(ResponseViewObject.error(err.message));
    }
})

export default musicRouter;
