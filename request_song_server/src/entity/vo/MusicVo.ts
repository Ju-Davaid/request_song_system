export interface Lyric {
    time: number;
    txt: string;
}

export interface MusicVo {
    name: string;
    singer: string;
    url?: string;
    songmid: string;
    duration: number;
    similarity: number;
    vip?: boolean;
    cover?: string;
    lyric?: Lyric[];
}

export interface SearchVo extends MusicVo {
    highlight: {
        name: string;
        singer: string;
    };
}