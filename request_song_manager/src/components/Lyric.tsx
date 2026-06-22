import usePlayerStore from "@/store/player.store";
import { useRef, useEffect, type FC } from "react";

interface LyricProps {
  classNames?: {
    root?: string;
    lyricContainer?: string;
    lyricItem?: string;
  };
}

const Lyric: FC<LyricProps> = ({ classNames }) => {
  const { root, lyricContainer, lyricItem } = classNames ?? {};
  // 鼠标是否停在歌词上
  const isHoverLyric = useRef(false);
  // 歌词滚动容器
  const scrollWrap = useRef<HTMLDivElement>(null);
  // 当前播放歌曲
  const currentMusic = usePlayerStore((state) => state.currentMusic);
  // 当前播放歌词索引
  const lyricIndex = usePlayerStore((state) => state.lyricIndex);
  // 设置当前播放时间
  const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);
  const isFirst = useRef(true);
  // 自动滚动到当前播放歌词，悬浮时暂停滚动
  useEffect(() => {
    const wrap = scrollWrap.current;
    if (!wrap || isHoverLyric.current) return;
    const activeLine = wrap.querySelector(`#lyric-${lyricIndex}`);
    if (!activeLine) return;
    activeLine.scrollIntoView({
      behavior: isFirst.current ? "instant" : "smooth",
      block: "center",
    });
    isFirst.current = false;
  }, [lyricIndex]);

  return (
    <div
      ref={scrollWrap}
      onMouseEnter={() => (isHoverLyric.current = true)}
      onMouseLeave={() => (isHoverLyric.current = false)}
      style={{
        maskImage:
          "linear-gradient(180deg, hsla(0, 0%, 100%, 0) 0, hsla(0, 0%, 100%, .6) 15%, #fff 25%, #fff 75%, hsla(0, 0%, 100%, .6) 85%, hsla(0, 0%, 100%, 0))",
        WebkitMaskImage:
          "linear-gradient(180deg, hsla(0, 0%, 100%, 0) 0, hsla(0, 0%, 100%, .6) 15%, #fff 25%, #fff 75%, hsla(0, 0%, 100%, .6) 85%, hsla(0, 0%, 100%, 0))",
        scrollbarWidth: "none",
      }}
      className={`w-full h-full relative overflow-y-scroll ${root}`}
    >
      <div
        className={`w-full py-10 absolute left-0 flex flex-col gap-1 ${lyricContainer}`}
      >
        {currentMusic?.lyric?.map((item, index) => (
          <div
            style={{
              color: lyricIndex === index ? "#31c27c" : "#fff",
            }}
            onClick={() => setCurrentTime(item.time / 1000)}
            id={`lyric-${index}`}
            key={index}
            className={`text-sm select-none cursor-pointer text-white opacity-50 text-center py-1 transition-opacity duration-300 ${lyricIndex === index && "opacity-100"} ${lyricItem}`}
          >
            {item.txt}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Lyric;
