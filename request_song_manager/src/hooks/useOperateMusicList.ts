
import usePlayerStore from "@/store/player.store";
import { useCallback } from "react"
import useMessage from "@/hooks/useMessage";
import { download } from "@/utils";
import type { MusicVo } from "@/types/Music";
import { clearMusicFromDB, deleteMusicFromDB, getMusicPlayUrl } from "@/api";
import useMusicBatchOperateStore from "@/store/musicBatchOperate.store";

const useOperateMusicList = () => {
    const { message } = useMessage()
    const musicList = usePlayerStore((state) => state.musicList);
    const setMusicList = usePlayerStore((state) => state.setMusicList);
    const changeMusic = usePlayerStore((state) => state.changeMusic);
    const nextMusic = usePlayerStore((state) => state.nextMusic);
    const currentMusic = usePlayerStore((state) => state.currentMusic);
    const checkedMusicList = useMusicBatchOperateStore((state) => state.checkedList);
    const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);
    const isBatchDeleting = useMusicBatchOperateStore((state) => state.isBatchDeleting);
    const isBatchDownloading = useMusicBatchOperateStore((state) => state.isBatchDownloading);
    const setIsBatchDeleting = useMusicBatchOperateStore((state) => state.setIsBatchDeleting);
    const setIsBatchDownloading = useMusicBatchOperateStore((state) => state.setIsBatchDownloading);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const togglePlay = usePlayerStore((state) => state.togglePlay);
    const setCheckedList = useMusicBatchOperateStore((state) => state.setCheckedList);
    // 下载音乐
    const downloadMusic = useCallback(async (music: MusicVo) => {
        if (!music.songmid) return;
        try {
            const url = (await getMusicPlayUrl(music.songmid)).data.url;
            await download(url, music.name);
            message.success("下载成功");
        } catch (err) {
            message.error("下载失败，请稍后重试");
            console.error(err);
        }
    }, []);
    // 清空所有音乐
    const clearAll = useCallback(async () => {
        try {
            await clearMusicFromDB();
            setMusicList([]);
            changeMusic(null);
            message.success("清空成功");
        } catch (err) {
            message.error("清空失败，请稍后重试");
            console.error(err);
        }
    }, [])
    // 删除音乐
    const deleteMusic = useCallback(async (item: MusicVo) => {
        if (!item.songmid) return;
        try {
            await deleteMusicFromDB(item.songmid);
            const newMusicList = musicList.filter((i) => i.songmid !== item.songmid);
            if (newMusicList.length === 0) {
                changeMusic(null);
                setCurrentTime(0);
            } else {
                if (currentMusic?.songmid === item.songmid) nextMusic();
            }
            setMusicList(newMusicList);
            message.success("删除成功");
        } catch (err) {
            message.error("删除失败，请稍后重试");
            console.error(err);
        }
    }, [musicList])
    // 批量删除音乐
    const batchDeleteMusic = useCallback(async () => {
        if (isBatchDeleting) return message.warning("请稍后再试");
        if (checkedMusicList.length === 0) return message.warning("请选择要删除的音乐");
        const deleteList = musicList.filter((song) => song.songmid && checkedMusicList.includes(song.songmid));
        try {
            setIsBatchDeleting(true);
            for (const music of deleteList) {
                if (music.songmid) {
                    await deleteMusicFromDB(music.songmid);
                }
            }
            const newMusicList = musicList.filter((i) => !i.songmid || !checkedMusicList.includes(i.songmid));
            if (newMusicList.length === 0) {
                changeMusic(null);
                setCurrentTime(0);
            } else {
                if (checkedMusicList.includes(currentMusic?.songmid ?? "")) nextMusic();
            }
            setMusicList(newMusicList);
            setCheckedList([]);
            message.success("批量删除成功");
        } catch (err) {
            console.error(err);
            message.error("批量删除失败，请稍后重试");
        } finally {
            setIsBatchDeleting(false);
        }
    }, [checkedMusicList, musicList, currentMusic, nextMusic, changeMusic, isBatchDeleting, setIsBatchDeleting])
    // 批量下载音乐
    const batchDownloadMusic = useCallback(async () => {
        if (isBatchDownloading) return message.warning("请稍后再试");
        if (checkedMusicList.length === 0) return message.warning("请选择要下载的音乐");
        const downloadList = musicList.filter((song) => song.songmid && checkedMusicList.includes(song.songmid));
        try {
            setIsBatchDownloading(true);
            for (const music of downloadList) {
                const { url, name } = music;
                const downloadUrl: string = url ?? (await getMusicPlayUrl(music.songmid!)).data.url;
                await download(downloadUrl, name);
            }
            setCheckedList([]);
            message.success("批量下载成功");
        } catch (err) {
            console.error(err);
            message.error("批量下载失败，请稍后重试");
        } finally {
            setIsBatchDownloading(false);
        }
    }, [checkedMusicList, musicList, isBatchDownloading, setIsBatchDownloading])
    // 点击播放按钮
    const toggleOrPauseMusic = useCallback(
        (item: MusicVo) => {
            if (item.songmid === currentMusic?.songmid) {
                togglePlay();
            } else {
                changeMusic(item);
            }
        },
        [isPlaying, currentMusic, togglePlay, changeMusic],
    );

    return {
        clearAll,
        downloadMusic,
        deleteMusic,
        batchDeleteMusic,
        batchDownloadMusic,
        toggleOrPauseMusic,
    }
}

export default useOperateMusicList