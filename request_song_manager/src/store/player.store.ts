import { create } from "zustand";
import type { MusicVo } from "@/types/Music";
import playOrderBtnList from "@/data/playOrderLayoutData";
import { getRandomNumber } from "@/utils";
import { deleteMusicFromDB, getMusicPlayUrl } from "@/api";
// 播放模式
type PlayOrderType = 0 | 1 | 2 | 3;
// 播放器监听配置
interface SetPlayerProps {
    player: HTMLAudioElement;
    onEnded?: (music?: MusicVo) => void;
    onDurationChange?: (music?: MusicVo) => void;
    onTimeUpdate?: (music?: MusicVo, currentTime?: number, lyricIndex?: number) => void;
    onError?: (music?: MusicVo) => void;
}
// 播放器状态
interface PlayerStore {
    Player: HTMLAudioElement | null;
    currentMusic: MusicVo | null;
    musicList: MusicVo[];
    lyricIndex: number;
    playlistIndex: number;
    playOrder: PlayOrderType;
    isPlaying: boolean;
    volume: number;
    currentTime: number;
    duration: number;
    isCleanMode: boolean;

    // 切换纯净模式
    toggleCleanMode: () => void;
    // 设置播放进度
    setCurrentTime: (time: number) => void;
    // 初始化播放器 + 绑定监听
    setPlayer: (props: SetPlayerProps) => void;
    // 销毁播放器、清空监听（防内存泄漏）
    destroyPlayer: () => void;
    // 完整替换歌单
    setMusicList: (musicList: MusicVo[]) => void;
    // 调整音量
    changeVolume: (volume: number) => void;
    // 暂停/播放切换
    togglePlay: () => void;
    // 通过歌曲对象切歌，支持更新后回调
    changeMusic: (music: MusicVo | null, onAfter?: (latestState: PlayerStore) => void) => void;
    // 通过下标切歌
    changeMusicByIndex: (index: number, onAfter?: (latestState: PlayerStore) => void) => void;
    // 下一首
    nextMusic: (onAfter?: (latestState: PlayerStore) => void) => void;
    // 上一首
    prevMusic: (onAfter?: (latestState: PlayerStore) => void) => void;
    // 拖拽进度条跳转
    changeProgress: (time: number) => void;
    // 切换播放模式
    changePlayOrder: () => void;
    // 添加单曲到列表
    addMusic: (music: MusicVo, onAfter?: (latestState: PlayerStore) => void) => void;
}

// 播放器监听缓存（闭包私有，外部不可访问）
let boundTimeUpdate: (() => void) | null = null;
let boundDurationChange: (() => void) | null = null;
let boundEnded: (() => void) | null = null;
let boundError: ((e: ErrorEvent) => void) | null = null;

// 应用播放音乐
export const applyPlayMusic = async (
    state: PlayerStore,
    targetIndex: number,
    player: HTMLAudioElement
): Promise<Partial<PlayerStore>> => {
    try {
        const music = state.musicList[targetIndex];
        if (!music.songmid) return {};
        const res = await getMusicPlayUrl(music.songmid);
        music.url = res.data.url;
        console.log("播放音乐:", music.name, music.singer, res);
        player.src = music.url ?? "";
        player.currentTime = 0;
        if (player.src) player.play();
        return {
            isPlaying: true,
            playlistIndex: targetIndex,
            currentMusic: music,
            currentTime: 0,
            duration: 0,
            lyricIndex: -1,
        };
    } catch (error) {
        console.error("应用播放音乐失败:", error);
        return {};
    }
};

/**
 * 播放器状态管理
 * @returns 播放器状态管理
 * */
const usePlayerStore = create<PlayerStore>((set, get) => ({
    Player: null,
    currentMusic: null,
    musicList: [],
    lyricIndex: 0,
    playlistIndex: 0,
    playOrder: 0,
    isPlaying: false,
    volume: 0.5,
    currentTime: 0,
    duration: 0,
    isCleanMode: false,

    toggleCleanMode: () => set(s => ({ isCleanMode: !s.isCleanMode })),

    setCurrentTime: (time) => {
        const state = get();
        if (!state.Player) return;
        state.Player.currentTime = time;
        set({ currentTime: time });
    },

    destroyPlayer: () => {
        const state = get();
        const player = state.Player;
        if (!player) return;

        // 移除全部监听
        boundTimeUpdate && player.removeEventListener("timeupdate", boundTimeUpdate);
        boundDurationChange && player.removeEventListener("durationchange", boundDurationChange);
        boundEnded && player.removeEventListener("ended", boundEnded);
        boundError && player.removeEventListener("error", boundError);

        boundTimeUpdate = null;
        boundDurationChange = null;
        boundEnded = null;
        boundError = null;

        set({ Player: null });
    },

    setPlayer: ({ player, onEnded, onDurationChange, onTimeUpdate, onError }) => {
        // 先销毁旧播放器监听
        get().destroyPlayer();
        set({ Player: player });
        player.volume = get().volume;
        player.autoplay = true;

        // 元数据加载
        player.addEventListener(
            "loadedmetadata",
            () => set({ duration: player.duration }),
            { once: true }
        );

        // 播放进度
        boundTimeUpdate = () => {
            set(state => {
                let lyricIndex = -1;
                const lyric = state.currentMusic?.lyric;
                const ms = player.currentTime * 1000;

                if (lyric) {
                    for (let i = 0; i < lyric.length; i++) {
                        if (lyric[i].time <= ms) lyricIndex = i;
                        else break;
                    }
                }
                onTimeUpdate?.(state.currentMusic ?? undefined, player.currentTime, lyricIndex);
                return { currentTime: player.currentTime, lyricIndex };
            });
        };
        player.addEventListener("timeupdate", boundTimeUpdate);

        // 时长变更
        boundDurationChange = () => {
            onDurationChange?.();
            set({ duration: player.duration });
        };
        player.addEventListener("durationchange", boundDurationChange);

        // 播放结束
        boundEnded = async () => {
            const state = get();
            const order = state.playOrder;
            const currentMusic = state.currentMusic;
            if (!currentMusic?.songmid) return;
            await deleteMusicFromDB(currentMusic.songmid);
            const newMusicList = state.musicList.filter(m => m.songmid !== currentMusic.songmid);
            if (newMusicList.length === 0) {
                set({
                    isPlaying: false,
                    currentMusic: null,
                    playlistIndex: 0,
                    currentTime: 0,
                    duration: 0,
                    lyricIndex: -1,
                    musicList: newMusicList,
                });
                return;
            };
            if (order === 0) {
                get().nextMusic();
            } else if (order === 1) {
                player.currentTime = 0;
                player.play();
            } else if (order === 2) {
                const randomIdx = getRandomNumber(0, state.musicList.length - 1);
                get().changeMusicByIndex(randomIdx);
            } else if (order === 3) {
                const nextIdx = state.playlistIndex + 1;
                if (nextIdx >= state.musicList.length) {
                    onEnded?.();
                    set({ isPlaying: false });
                } else {
                    get().changeMusicByIndex(nextIdx);
                }
            }
            set({ musicList: newMusicList });
        };
        player.addEventListener("ended", boundEnded);

        // 播放错误
        boundError = (e) => {
            console.error("audio error:", e.message);
            const state = get();
            onError?.(state.currentMusic ?? undefined);
            if (state.musicList.length > 1) get().nextMusic();
        };
        player.addEventListener("error", boundError);
    },

    setMusicList: (musicList) => set({ musicList }),

    changeVolume: (volume) => {
        const state = get();
        if (!state.Player) return;
        state.Player.volume = volume;
        set({ volume });
    },

    togglePlay: () => {
        const state = get();
        if (!state.Player || !state.Player.src) return;
        const nextPlay = !state.isPlaying;
        nextPlay ? state.Player.play() : state.Player.pause();
        set({ isPlaying: nextPlay });
    },
    changeMusic: async (music, onAfter) => {
        const state = get();
        if (!music) {
            if (state.Player) {
                state.Player.pause();
                state.Player.currentTime = 0;
                state.Player.src = "";
            }
            return set({ currentMusic: null, isPlaying: false, playlistIndex: 0, currentTime: 0 });
        }
        if (!state.Player) return;
        const targetIndex = state.musicList.findIndex(s => s.songmid === music.songmid);
        if (targetIndex === -1) return;
        set(await applyPlayMusic(state, targetIndex, state.Player));
        const latestState = get();
        onAfter?.(latestState);
    },

    changeMusicByIndex: async (index, onAfter) => {
        const state = get();
        const player = state.Player;
        if (!player || index < 0 || index >= state.musicList.length) return;
        set(await applyPlayMusic(state, index, player));
        const latestState = get();
        onAfter?.(latestState);
    },

    nextMusic: async (onAfter) => {
        const state = get();
        const player = state.Player;
        if (!player || state.musicList.length === 0) return;

        const nextIdx = (state.playlistIndex + 1) % state.musicList.length;
        set(await applyPlayMusic(state, nextIdx, player));
        const latestState = get();
        onAfter?.(latestState);
    },

    prevMusic: async (onAfter) => {
        const state = get();
        const player = state.Player;
        if (!player || state.musicList.length === 0) return;

        const prevIdx = (state.playlistIndex - 1 + state.musicList.length) % state.musicList.length;
        set(await applyPlayMusic(state, prevIdx, player));
        const latestState = get();
        onAfter?.(latestState);
    },

    changeProgress: (time) => {
        const state = get();
        if (!state.Player || time > state.duration) return;
        state.Player.currentTime = time;
        set({ currentTime: time });
    },

    changePlayOrder: () => {
        const state = get();
        const max = playOrderBtnList.length;
        const nextOrder = (state.playOrder + 1) % max;
        set({ playOrder: nextOrder as PlayOrderType });
    },

    addMusic: (music, onAfter) => {
        const state = get();
        const exists = state.musicList.some(item => item.songmid === music.songmid);
        if (exists) {
            onAfter?.(state);
            return {};
        }
        set({ musicList: [...state.musicList, music] });
        const latestState = get();
        // 新增后无当前歌曲，自动切第一首
        if (!latestState.currentMusic && latestState.musicList.length) {
            get().changeMusicByIndex(0, onAfter);
        } else {
            onAfter?.(latestState);
        }
    },
}));

export default usePlayerStore;