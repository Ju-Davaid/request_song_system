interface PlayOrderBtn {
    title: string;
    size: number[];
    position: number[];
}

const playOrderBtnList: PlayOrderBtn[] = [
    {
        title: "列表循环",
        size: [26, 25],
        position: [0, -205],
    },
    {
        title: "单曲循环",
        size: [26, 25],
        position: [0, -232],
    },
    {
        title: "随机播放",
        size: [25, 19],
        position: [0, -74],
    },
    {
        title: "顺序播放",
        size: [23, 20],
        position: [0, -260],
    },
];
export default playOrderBtnList;