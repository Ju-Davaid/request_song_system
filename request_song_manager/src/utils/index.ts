/**
 * 秒数 转为 mm:ss
 * @param seconds 总秒数
 * @returns 格式化时间 例：04:18
 */
export const formatSecondToTime = (seconds: number | string): string => {
    // 统一转为数字，非数字兜底0
    let totalSec = Number(seconds);
    if (isNaN(totalSec)) totalSec = 0;
    // 禁止负数
    totalSec = Math.max(0, Math.floor(totalSec));

    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;

    // 两位补零
    const m = String(min).padStart(2, "0");
    const s = String(sec).padStart(2, "0");

    return `${m}:${s}`;
};
/**
 * 随机数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机数
 */
export const getRandomNumber = (min: number, max: number): number => {
    // 先确保 min <= max
    const [x, y] = min > max ? [max, min] : [min, max];
    return Math.floor(Math.random() * (y - x + 1)) + x;
}
/**
 * 判断是否是相同时长的歌曲
 * @param duration 音乐时长
 * @param playerDuration 播放器时长
 * @returns 是否是相同时长的歌曲
 */
export const isSameDuration = (duration: number, playerDuration: number) => {
    const durationDiff = Math.abs(duration - playerDuration);
    return durationDiff <= 5;
}

export { loadFont } from './loadFont';
export * from '../hooks/useBuildTableRenderData';
export { debounce } from './debounce';
export { download } from './download';