import requestMusicServer from '../music';
import axios from 'axios';
import { MusicVo } from '../entity/vo/MusicVo';
import { similarAlgorithm } from './similarAlgorithm';
import ResponseViewObject from '../entity/vo/ResponseViewObject';



const getMusicInfoByName = async (songName: string) => {
    try {
        const searchRes: any = await requestMusicServer(`/getSearchByKey?key=${songName}&limit=20`, "GET")
        const songList: any[] = searchRes.data.response.data.song.list;

        // 获取歌曲封面信息
        const songInfoList = (await axios.get(`https://ffapi.cn/int/v1/dg_qqmusic?msg=${songName}&limit=20&format=json&n=`)).data.data;

        // 计算每首歌曲与 songName 的相似度，并添加到歌曲信息中
        const songsWithSimilarity = songList.map<MusicVo>((item) => {
            const name = item.songname;
            const singer = item.singer[0].name;
            const cover = songInfoList.find((info: any) => info.title.includes(name) && info.singer.includes(singer))?.pic ?? "";
            const duration = item.interval;
            // 计算相似度（综合歌名和歌手名）
            const nameSimilarity = similarAlgorithm(name, songName);
            const singerSimilarity = similarAlgorithm(singer, songName);
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
        return ResponseViewObject.success({
            url,
            ...topMatch,
        })
    } catch (err: any) {
        return ResponseViewObject.error(err.message);
    }
}

export default getMusicInfoByName;