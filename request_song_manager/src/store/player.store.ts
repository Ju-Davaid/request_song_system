import { create } from "zustand"

interface PlayerStore {
    Player: HTMLAudioElement | null
    isPlaying: boolean
    isMuted: boolean
    volume: number
    currentTime: number
    duration: number
    setPlayer: (player: HTMLAudioElement) => void
    toggleMute: () => void
    changeVolume: (volume: number) => void
    togglePlay: () => void
    changeMusic: (src: string) => void
    changeProgress: (time: number) => void
}

const usePlayerStore = create<PlayerStore>((set) => {
    // 监听器
    let boundTimeUpdate: (() => void) | null = null
    let boundDurationChange: (() => void) | null = null

    return {
        Player: null,
        isPlaying: false,
        isMuted: false,
        volume: 0.5,
        currentTime: 0,
        duration: 0,
        setPlayer: (player: HTMLAudioElement) => {
            // 移除旧的监听器
            if (boundTimeUpdate) {
                player.removeEventListener("timeupdate", boundTimeUpdate);
            }
            if (boundDurationChange) {
                player.removeEventListener("durationchange", boundDurationChange);
            }
            
            set(() => ({ Player: player }));
            
            // loadedmetadata 只需要触发一次
            player.addEventListener("loadedmetadata", () => {
                set({ duration: player.duration });
            }, { once: true });
            
            // timeupdate 需要持续监听
            boundTimeUpdate = () => {
                set({ currentTime: player.currentTime });
            };
            player.addEventListener("timeupdate", boundTimeUpdate);
            
            // durationchange 持续监听
            boundDurationChange = () => {
                set({ duration: player.duration });
            };
            player.addEventListener("durationchange", boundDurationChange);
            
            player.volume = 0.5;
        },
        toggleMute: () => set((state) => {
            if (!state.Player) return {};
            state.Player.muted = !state.Player.muted;
            return { isMuted: !state.isMuted };
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
        changeMusic: (src: string) => set((state) => {
            if (!state.Player) return {};
            state.Player.src = src;
            state.Player.currentTime = 0;
            return {
                currentTime: 0,
                isPlaying: false,
                duration: 0
            };
        }),
        changeProgress: (time: number) => set((state) => {
            if (!state.Player) return {};
            state.Player.currentTime = time;
            return { currentTime: time };
        }),
    };
})

export default usePlayerStore