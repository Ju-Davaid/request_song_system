import {
  AiFillStepBackward,
  AiFillStepForward,
  AiFillSound,
} from "react-icons/ai";
import { FaVolumeMute } from "react-icons/fa";
import { FaPlay, FaPause } from "react-icons/fa";
import playerIcon1x from "@/assets/images/play_icon_1x.png";
import playerIcon2x from "@/assets/images/player_icon_2x.png";
import ProgressBar from "@/components/ProgressBar";
import { Tooltip } from "antd";
import playOrderBtnList from "@/data/playOrderLayoutData";
import usePlayerStore from "@/store/player.store";
import { formatSecondToTime } from "@/utils";

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
  return (
    <div className="mx-[6%] pb-10 flex items-center">
      {/* 音乐控制按钮 */}
      <div className="flex gap-10 items-center">
        <AiFillStepBackward
          onClick={() => prevMusic()}
          size={35}
          className="text-white cursor-pointer text-2xl opacity-80 hover:opacity-100 transition-opacity duration-300"
        />
        {isPlaying ? (
          <FaPause
            onClick={() => togglePlay()}
            size={25}
            className="text-white cursor-pointer text-2xl opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        ) : (
          <FaPlay
            onClick={() => togglePlay()}
            size={25}
            className="text-white cursor-pointer text-2xl opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        )}
        <AiFillStepForward
          onClick={() => nextMusic()}
          size={35}
          className="text-white cursor-pointer text-2xl opacity-80 hover:opacity-100 transition-opacity duration-300"
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
        <div className="relative size-7.5">
          {playOrderBtnList.map(
            ({ title, position: [x, y], size: [w, h] }, index) => (
              <Tooltip key={index} title={title} color="#fff">
                <div
                  onClick={() => changePlayOrder()}
                  style={{
                    backgroundImage: ` image-set(url(${playerIcon1x}) 1x,url(${playerIcon2x}) 2x)`,
                    backgroundPosition: `${x}px ${y}px`,
                    width: `${w}px`,
                    height: `${h}px`,
                  }}
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-300 ${playOrder !== index && "hidden"}`}
                ></div>
              </Tooltip>
            ),
          )}
        </div>
        {/* 音量控制 */}
        <div className="flex gap-2 items-center">
          <div className="size-10 relative" onClick={() => changeVolume(0)}>
            {volume == 0 ? (
              <FaVolumeMute
                size={30}
                className="text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-2xl opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            ) : (
              <AiFillSound
                size={30}
                className="text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-2xl opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            )}
          </div>
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
  );
};

export default MusicController;
