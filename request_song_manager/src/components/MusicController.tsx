import ProgressBar from "@/components/ProgressBar";
import { Tooltip } from "antd";
import playOrderBtnList from "@/data/playOrderLayoutData";
import usePlayerStore from "@/store/player.store";
import { formatSecondToTime } from "@/utils";
import SpiritButton from "@/components/SpiritButton";
import { useCallback } from "react";
import useMessage from "@/hooks/useMessage";

/**
 * 音乐控制组件
 */
const MusicController = () => {
  // 播放顺序 (0: 列表循环, 1: 单曲循环, 2: 随机播放  3: 顺序播放)
  const playOrder = usePlayerStore((state) => state.playOrder);
  const changePlayOrder = usePlayerStore((state) => state.changePlayOrder);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const duration = usePlayerStore((state) => state.duration);
  const currentTime = usePlayerStore((state) => state.currentTime);
  const setCurrentTime = usePlayerStore((state) => state.changeProgress);
  const volume = usePlayerStore((state) => state.volume);
  const changeVolume = usePlayerStore((state) => state.changeVolume);
  const currentMusic = usePlayerStore((state) => state.currentMusic);
  const nextMusic = usePlayerStore((state) => state.nextMusic);
  const prevMusic = usePlayerStore((state) => state.prevMusic);
  const { warning, success, error, contextHolder } = useMessage();
  const isCleanMode = usePlayerStore((state) => state.isCleanMode);
  const toggleCleanMode = usePlayerStore((state) => state.toggleCleanMode);
  const handelDownload = useCallback(async () => {
    if (!currentMusic?.url) return warning("暂无下载链接");
    const { url, name } = currentMusic;

    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = name ?? "未知音频";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      success("下载成功");
    } catch (err) {
      error("下载失败，请稍后重试");
      console.error(err);
    }
  }, [currentMusic]);
  return (
    <>
      <div className="mx-[6%] pb-10 flex items-center">
        {/* 音乐控制按钮 */}
        <div className="flex gap-10 items-center">
          <SpiritButton
            onClick={() => prevMusic()}
            width={19}
            height={20}
            position={[0, -30]}
          />
          <SpiritButton
            onClick={() => togglePlay()}
            width={21}
            height={29}
            position={[isPlaying ? -30 : 0, 0]}
          />
          <SpiritButton
            onClick={() => nextMusic()}
            width={19}
            height={20}
            position={[0, -52]}
          />
        </div>
        {/* 歌曲信息 */}
        <div className="flex-1 px-10">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-white opacity-80 mb-3 text-sm">
              {currentMusic?.name} - {currentMusic?.singer}
            </h1>
            <div className="text-sm text-white opacity-80">
              {formatSecondToTime(currentTime)} / {formatSecondToTime(duration)}
            </div>
          </div>
          <ProgressBar
            value={(currentTime / duration) * 100}
            onChangeComplete={(value) => {
              setCurrentTime((value / 100) * duration);
            }}
          />
        </div>
        {/* 右侧按钮 */}
        <div className="flex gap-4 items-center">
          {/* 播放顺序按钮 */}
          {playOrderBtnList.map(
            ({ title, position: [x, y], size: [w, h] }, index) => (
              <Tooltip key={index} title={title} color="#fff">
                <div className={`size-7.5 relative ${playOrder !== index && "hidden"}`}>
                  <SpiritButton
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-300`}
                    onClick={() => changePlayOrder()}
                    position={[x, y]}
                    width={w}
                    height={h}
                  />
                </div>
              </Tooltip>
            ),
          )}
          {/* 下载按钮 */}
          <SpiritButton
            onClick={handelDownload}
            position={[0, -120]}
            width={22}
            height={21}
          />
          {/* 模式切换按钮  */}
          <SpiritButton
            onClick={() => toggleCleanMode()}
            position={[0, isCleanMode ? -311 : -282]}
            width={74}
            height={26}
          />
          {/* 音量控制 */}
          <div className="flex gap-2 items-center">
            <SpiritButton
              onClick={() => changeVolume(volume == 0 ? 0.5 : 0)}
              position={[0, volume == 0 ? -182 : -144]}
              width={26}
              height={21}
            />
            <div className="w-20">
              <ProgressBar
                value={volume * 100}
                onChange={(value) => {
                  changeVolume(value / 100);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {contextHolder}
    </>
  );
};

export default MusicController;
