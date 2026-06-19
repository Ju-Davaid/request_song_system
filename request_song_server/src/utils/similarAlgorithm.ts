/**
 * 中文字符串清洗
 * @param str 原始文本
 * @returns 纯汉字+数字字母文本
 */
const cleanCnStr = (str: string): string => {
    return str.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "");
}
const getCn2Gram = (str: string): Set<string> => {
    const text = cleanCnStr(str);
    const grams = new Set<string>();
    const chars = Array.from<string>(text);
    // 单字特殊处理：直接存入自身
    if (chars.length === 1) {
        grams.add(chars[0]);
        return grams;
    }
    for (let i = 0; i < chars.length - 1; i++) {
        grams.add(chars[i] + chars[i + 1]);
    }
    return grams;
}

/**
 * 中文二元分词杰卡德相似度（中文场景效果最好）
 * @returns 0~1，越高越相似
 */
export const similarAlgorithm = (str1: string, str2: string): number => {
    const set1 = getCn2Gram(str1);
    const set2 = getCn2Gram(str2);

    // 交集
    const intersection = new Set<string>();
    set1.forEach(item => set2.has(item) && intersection.add(item));
    // 并集
    const union = new Set([...set1, ...set2]);

    if (union.size === 0) return 1;
    return Number((intersection.size / union.size).toFixed(4));
}