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
    vip?: boolean,
    similarity?: number,
}