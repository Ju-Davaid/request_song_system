/**
 * 秒数 转为 mm:ss
 * @param seconds 总秒数
 * @returns 格式化时间 例：04:18
 */
export const formatSecondToTime = (seconds: number): string => {
    // 兜底防止负数/NaN
    const total = Math.max(0, Math.floor(seconds));
    const min = Math.floor(total / 60);
    const sec = total % 60;
    // 补零：不足两位前面加 0
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}
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

export { loadFont } from './loadFont';