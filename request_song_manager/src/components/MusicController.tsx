import ProgressBar from "@/components/ProgressBar";
import { Tooltip } from "antd";
import playOrderBtnList from "@/data/playOrderLayoutData";
import usePlayerStore from "@/store/player.store";
import { formatSecondToTime } from "@/utils";
import SpiritButton from "@/components/SpiritButton";
import { useEffect } from "react";
import musicList from "@/data/musicMockData";
import { isSameDuration } from "@/utils";
import useMusicList from "@/hooks/useOperateMusicList";

/**
 * 音乐控制组件
 */
const MusicController = () => {
  // 播放顺序 (0: 列表循环, 1: 单曲循环, 2: 随机播放  3: 顺序播放)
  const playOrder = usePlayerStore((state) => state.playOrder);
  const changePlayOrder = usePlayerStore((state) => state.changePlayOrder);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const playerDuration = usePlayerStore((state) => state.duration);
  const currentTime = usePlayerStore((state) => state.currentTime);
  const setCurrentTime = usePlayerStore((state) => state.changeProgress);
  const volume = usePlayerStore((state) => state.volume);
  const changeVolume = usePlayerStore((state) => state.changeVolume);
  const currentMusic = usePlayerStore((state) => state.currentMusic);
  const nextMusic = usePlayerStore((state) => state.nextMusic);
  const prevMusic = usePlayerStore((state) => state.prevMusic);
  const { MessageContextHolder, downloadMusic } = useMusicList();
  const isCleanMode = usePlayerStore((state) => state.isCleanMode);
  const toggleCleanMode = usePlayerStore((state) => state.toggleCleanMode);

  // 键盘事件  空格键: 播放/暂停
  useEffect(() => {
    const handelKeyboardEvent = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        const tag = (e.target as HTMLElement).tagName;
        if (!["INPUT", "TEXTAREA"].includes(tag)) {
          currentMusic && togglePlay();
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keyup", handelKeyboardEvent);
    return () => {
      document.removeEventListener("keyup", handelKeyboardEvent);
    };
  }, [togglePlay, currentMusic]);
  return (
    <>
      <div className="mx-[6%] pb-10 flex items-center">
        {/* 音乐控制按钮 */}
        <div className="flex gap-10 items-center">
          <SpiritButton
            disabled={musicList.length === 0}
            onClick={() => prevMusic()}
            width={19}
            height={20}
            position={[0, -30]}
          />
          <SpiritButton
            disabled={!currentMusic}
            onClick={togglePlay}
            width={21}
            height={29}
            position={[isPlaying ? -30 : 0, 0]}
          />
          <SpiritButton
            disabled={musicList.length === 0}
            onClick={nextMusic}
            width={19}
            height={20}
            position={[0, -52]}
          />
        </div>
        {/* 歌曲信息 */}
        <div className="flex-1 px-10">
          <div className="flex w-full justify-between items-center mb-3">
            <div className="flex flex-1 items-center gap-4">
              <h1 className="text-white opacity-80 text-sm">
                {currentMusic?.name} - {currentMusic?.singer}
              </h1>
              {currentMusic &&
                !isSameDuration(
                  currentMusic.duration as number,
                  playerDuration,
                ) && (
                  <div className="flex-1 text-primary line-clamp-1 opacity-80 text-sm">
                    试听阶段，试听时长为
                    {formatSecondToTime(playerDuration)}
                    ，完整播放需要登录会员账号或重新登录
                  </div>
                )}
            </div>
            <div className="text-sm text-white opacity-80">
              {formatSecondToTime(currentTime)} /{" "}
              {formatSecondToTime(currentMusic?.duration as number)}
            </div>
          </div>
          <ProgressBar
            className={
              !currentMusic && "pointer-events-none cursor-not-allowed"
            }
            value={((currentTime / currentMusic?.duration) as number) * 100}
            onChangeComplete={(value) => {
              setCurrentTime(
                (value / 100) * (currentMusic?.duration as number),
              );
            }}
          />
        </div>
        {/* 右侧按钮 */}
        <div className="flex gap-4 items-center">
          {/* 播放顺序按钮 */}
          {playOrderBtnList.map(
            ({ title, position: [x, y], size: [w, h] }, index) => (
              <Tooltip key={index} title={title} color="#fff">
                <div
                  className={`size-7.5 relative ${playOrder !== index && "hidden"}`}
                >
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
            disabled={!currentMusic}
            onClick={() => downloadMusic(currentMusic)}
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
      {MessageContextHolder}
    </>
  );
};

export default MusicController;
