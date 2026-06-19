import { create } from "zustand"
import type { MusicVo } from "@/types/Music";
import playOrderBtnList from "@/data/playOrderLayoutData";
import { getRandomNumber } from "@/utils";

interface SetPlayerProps {
    player: HTMLAudioElement
    onEnded?: (music?: MusicVo) => void
    onDurationChange?: (music?: MusicVo) => void
    onTimeUpdate?: (music?: MusicVo, currentTime?: number, lyricIndex?: number) => void
    onError?: (music?: MusicVo) => void
}

interface PlayerStore {
    Player: HTMLAudioElement | null
    currentMusic: MusicVo | null
    musicList: MusicVo[]
    lyricIndex: number
    playlistIndex: number
    playOrder: number
    isPlaying: boolean
    volume: number
    currentTime: number
    duration: number
    /**
     * 设置当前播放时间
     * @param time 时间
     */
    setCurrentTime: (time: number) => void
    /**
     * 设置播放器
     * @param player HTMLAudioElement
     */
    setPlayer: (props: SetPlayerProps) => void
    /**
     * 设置音乐列表
     * @param musicList 音乐列表
     */
    setMusicList: (musicList: MusicVo[]) => void
    /**
     * 设置音量
     * @param volume 音量
     */
    changeVolume: (volume: number) => void
    /**
     * 切换播放状态
     */
    togglePlay: () => void
    /**
     * 切换音乐
     * @param music MusicVo
     */
    changeMusic: (music: MusicVo) => void
    changeMusicByIndex: (index: number) => void
    nextMusic: () => void
    prevMusic: () => void
    /**
     * 切换进度
     * @param time 时间
     */
    changeProgress: (time: number) => void
    changePlayOrder: () => void
    addMusic: (music: MusicVo) => void
}

const usePlayerStore = create<PlayerStore>((set) => {
    // 监听器
    let boundTimeUpdate: (() => void) | null = null
    let boundDurationChange: (() => void) | null = null
    let boundEnded: (() => void) | null = null
    let boundError: ((e: ErrorEvent) => void) | null = null

    return {
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
        setPlayer: ({ player, onEnded, onDurationChange, onTimeUpdate, onError }) => {
            // 移除旧的监听器
            if (boundTimeUpdate) {
                player.removeEventListener("timeupdate", boundTimeUpdate);
                boundTimeUpdate = null;
            }
            if (boundDurationChange) {
                player.removeEventListener("durationchange", boundDurationChange);
                boundDurationChange = null;
            }
            if (boundEnded) {
                player.removeEventListener("ended", boundEnded);
                boundEnded = null;
            }
            if (boundError) {
                player.removeEventListener("error", boundError);
                boundError = null;
            }

            set(() => ({ Player: player }));

            // loadedmetadata 只需要触发一次
            player.addEventListener("loadedmetadata", () => {
                set({ duration: player.duration });
            }, { once: true });

            // timeupdate 需要持续监听
            boundTimeUpdate = () => {
                set((state) => {
                    onTimeUpdate?.(state.currentMusic, player.currentTime, state.lyricIndex);
                    const lyric = state.currentMusic?.lyric;
                    let lyricIndex = -1;
                    if (lyric) {
                        const currentTime = player.currentTime * 1000;
                        // 找到最后一个小于等于当前播放时间的歌词索引
                        for (let i = 0; i < lyric.length; i++) {
                            if (lyric[i].time <= currentTime) {
                                lyricIndex = i;
                            } else {
                                break;
                            }
                        }
                        // console.log("player.currentTime", currentTime);
                    }
                    return { currentTime: player.currentTime, lyricIndex };
                });
            };
            player.addEventListener("timeupdate", boundTimeUpdate);

            // durationchange 持续监听
            boundDurationChange = () => {
                onDurationChange?.();
                set({ duration: player.duration });
            };

            player.addEventListener("durationchange", boundDurationChange);

            // ended 持续监听
            boundEnded = () => {
                set((state) => {
                    if (state.playOrder === 0) {
                        const playlistIndex = (state.playlistIndex + 1) % state.musicList.length;
                        const music = state.musicList[playlistIndex];
                        player.src = music.url;
                        player.currentTime = 0;
                        player.play();
                        return {
                            isPlaying: true,
                            playlistIndex,
                            currentMusic: music,
                            currentTime: 0,
                            duration: 0,
                            lyricIndex: -1
                        };
                    } else if (state.playOrder === 1) {
                        player.currentTime = 0;
                        player.play();
                        return { currentTime: 0 };
                    } else if (state.playOrder === 2) {
                        const randomIndex = getRandomNumber(0, state.musicList.length - 1);
                        const music = state.musicList[randomIndex];
                        player.src = music.url;
                        player.currentTime = 0;
                        player.play();
                        return {
                            isPlaying: true,
                            playlistIndex: randomIndex,
                            currentMusic: music,
                            currentTime: 0,
                            duration: 0,
                            lyricIndex: -1
                        };
                    } else if (state.playOrder === 3) {
                        const playlistIndex = state.playlistIndex + 1;
                        if (playlistIndex >= state.musicList.length) {
                            onEnded?.();
                            return { isPlaying: false };
                        }
                        const music = state.musicList[playlistIndex];
                        player.src = music.url;
                        player.currentTime = 0;
                        player.play();
                        return {
                            isPlaying: true,
                            playlistIndex,
                            currentMusic: music,
                            currentTime: 0,
                            duration: 0,
                            lyricIndex: -1
                        };
                    }
                    return {};
                });
            };
            player.addEventListener("ended", boundEnded);
            boundError = (e: ErrorEvent) => {
                console.error(e.message);
                set((state) => {
                    onError?.(state.currentMusic);
                    if (!player || state.musicList.length === 0) return {};
                    const playlistIndex = (state.playlistIndex + 1) % state.musicList.length;
                    const music = state.musicList[playlistIndex];
                    player.src = music.url;
                    player.currentTime = 0;
                    if (state.isPlaying) {
                        player.play();
                    }
                    return {
                        playlistIndex,
                        currentMusic: music,
                        currentTime: 0,
                        duration: 0,
                        lyricIndex: -1
                    };
                });
            };
            player.addEventListener("error", boundError);
            player.volume = 0.5;
        },
        setCurrentTime: (time: number) => set((state) => {
            state.Player.currentTime = time;
            return { currentTime: time };
        }),
        setMusicList: (musicList: MusicVo[]) => set(() => ({ musicList })),
        addMusic: (music: MusicVo) => set((state) => {
            const isExist = state.musicList.some((item) => item.songmid === music.songmid);
            if (isExist) return {};
            return { musicList: [...state.musicList, music] };
        }),
        changeVolume: (volume: number) => set((state) => {
            if (!state.Player) return {};
            state.Player.volume = volume;
            return { volume };
        }),
        togglePlay: () => set((state) => {
            if (!state.Player) return {};
            const isPlaying = !state.isPlaying;
            if (isPlaying) {
                state.Player.play();
            } else {
                state.Player.pause();
            }
            return { isPlaying };
        }),
        changeMusic: (music: MusicVo) => set((state) => {
            if (!state.Player || !music) return {};
            console.log("changeMusic", music.name);
            state.Player.src = music.url;
            state.Player.currentTime = 0;
            if (state.isPlaying) {
                state.Player.play();
            }
            return {
                currentMusic: music,
                currentTime: 0,
                duration: 0,
                lyricIndex: -1
            };
        }),
        nextMusic: () => set((state) => {
            if (!state.Player || state.musicList.length === 0) return {};
            const playlistIndex = (state.playlistIndex + 1) % state.musicList.length;
            const music = state.musicList[playlistIndex];
            state.Player.src = music.url;
            state.Player.currentTime = 0;
            if (state.isPlaying) {
                state.Player.play();
            }
            return {
                playlistIndex,
                currentMusic: music,
                currentTime: 0,
                duration: 0,
                lyricIndex: -1
            };
        }),
        prevMusic: () => set((state) => {
            if (!state.Player || state.musicList.length === 0) return {};
            const playlistIndex = (state.playlistIndex - 1 + state.musicList.length) % state.musicList.length;
            const music = state.musicList[playlistIndex];
            state.Player.src = music.url;
            state.Player.currentTime = 0;
            if (state.isPlaying) {
                state.Player.play();
            }
            return {
                playlistIndex,
                currentMusic: music,
                currentTime: 0,
                duration: 0,
                lyricIndex: -1
            };
        }),
        changeMusicByIndex: (index: number) => set((state) => {
            if (!state.Player || index < 0 || index >= state.musicList.length) return {};
            const music = state.musicList[index];
            state.Player.src = music.url;
            state.Player.currentTime = 0;
            if (state.isPlaying) {
                state.Player.play();
            }
            return {
                playlistIndex: index,
                currentMusic: music,
                currentTime: 0,
                duration: 0,
                lyricIndex: -1
            };
        }),
        changeProgress: (time: number) => set((state) => {
            if (!state.Player) return {};
            state.Player.currentTime = time;
            return { currentTime: time };
        }),
        changePlayOrder: () => set((state) => {
            if (!state.Player) return {};
            state.playOrder = (state.playOrder + 1) % playOrderBtnList.length;
            return { playOrder: state.playOrder };
        }),
    };
})

export default usePlayerStore