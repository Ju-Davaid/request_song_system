export interface MusicVo {
    name: string;
    singer: string;
    url?: string;
    songmid: string;
    similarity: number;
    vip?: boolean;
    cover?: string;
    lyric?: string;
}