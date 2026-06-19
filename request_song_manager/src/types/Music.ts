interface Lyric {
    time: number,
    txt: string,
}
export interface MusicVo {
    cover: string,
    name: string,
    songmid?: string,
    singer: string,
    url: string,
    lyric?: Lyric[],
    duration?: number | string,
    vip?: boolean,
    similarity?: number,
}