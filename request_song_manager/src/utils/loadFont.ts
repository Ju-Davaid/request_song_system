/**
 * 加载飞波正点体字体
 */
export const loadFont = async () => {
    const font = new FontFace(
        'HuaWenFont', // 字体名称，后续统一用这个
        // 路径 + 修正 format：ttf 对应 truetype
        `url(${new URL('../assets/font/华文琥珀.ttf', import.meta.url)}) format('truetype')`
    );

    try {
        await font.load();
        document.fonts.add(font);
        console.log('✅ 华文琥珀 加载成功');
    } catch (err) {
        console.error('❌ 华文琥珀加载失败：', err);
    }
};
