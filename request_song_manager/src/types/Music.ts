interface Lyric {
    time: number,
    txt: string,
}
export interface MusicVo {
    cover: string,
    name: string,
    songmid?: string,
    singer: string,
    url?: string,
    lyric?: Lyric[],
    duration?: number,
    vip?: boolean,
    similarity?: number,
}

export interface SearchVo extends MusicVo {
    highlight: {
        name: string;
        singer: string;
    };
}