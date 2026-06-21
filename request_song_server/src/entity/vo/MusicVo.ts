export interface MusicVo {
    name: string;
    singer: string;
    url?: string;
    songmid: string;
    duration: number;
    similarity: number;
    vip?: boolean;
    cover?: string;
    lyric?: string;
}

export interface SearchVo extends MusicVo {
    highlight: {
        name: string;
        singer: string;
    };
}