import { useState } from "react";
import bgImage from "@/assets/images/background.jpeg";
import useSocket from "@/hooks/useSocket";
import useMessage from "@/hooks/useMessage";
import { SocketRoleEnum } from "@/enum/SocketRoleEnum";

const RequestSongPage = () => {
  // 输入框状态
  const [songName, setSongName] = useState<string>("");
  const { requestSong } = useSocket({ role: SocketRoleEnum.USER });
  const { message } = useMessage();

  // 点歌请求
  const handleOrderSong = async () => {
    const val = songName.trim();
    if (!val) return;
    try {
      requestSong(val);
      setSongName("");
      message.success("点歌成功");
    } catch (err) {
      console.error("点歌失败：", err);
      message.error("点歌失败，请稍后重试");
    }
  };

  // 回车触发点歌
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleOrderSong();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5">
      {/* 背景图 */}
      <img
        src={bgImage}
        alt=""
        className="fixed inset-0 w-full h-full -z-20 object-cover object-center"
      />

      {/* 毛玻璃遮罩 */}
      <div className="fixed inset-0 w-full h-full bg-black/70 backdrop-blur-md -z-10"></div>

      {/* 主体内容 */}
      <div className="w-full max-w-175 flex flex-col items-center text-center gap-5">
        {/* 标题区域 */}
        <div className="mb-[clamp(40px,8vw,70px)] flex flex-col gap-[clamp(12px,4vw,24px)]">
          <h1 className="text-[clamp(36px,10vw,68px)] font-bold text-white drop-shadow-[0_0_6px_rgba(0,0,0,0.5)]">
            老友会桌球🎱
          </h1>
          <h2 className="text-[clamp(22px,6vw,40px)] font-bold text-white drop-shadow-[0_0_6px_rgba(0,0,0,0.5)]">
            在线点歌台
          </h2>
          <p className="text-[clamp(16px,4vw,36px)] text-gray-300 drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]">
            输入歌名 / 歌手，快速点歌
          </p>
        </div>

        {/* 搜索点歌栏 */}
        <div className="w-full h-[clamp(60px,12vw,96px)] relative flex items-center pl-[clamp(20px,6vw,36px)] rounded-full bg-black/75 border border-white/20">
          <i className="fa fa-search text-[clamp(16px,4vw,20px)] text-gray-500 mr-3"></i>
          <input
            type="text"
            placeholder="请输入你想点的歌曲"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-full bg-transparent border-none outline-none text-white text-[clamp(16px,4vw,32px)]"
          />
          <button
            onClick={handleOrderSong}
            className="absolute right-0 top-0 w-[clamp(100px,35vw,300px)] h-full rounded-full bg-[#E60026] text-white font-medium text-[clamp(16px,5vw,34px)] flex items-center justify-center border-none cursor-pointer"
          >
            点歌
          </button>
        </div>

        {/* 底部提示 */}
        <p className="mt-[clamp(30px,8vw,70px)] text-[clamp(14px,3vw,30px)] text-gray-200 drop-shadow-[0_0_3px_#000]">
          🎵 百万曲库·实时播放·随时点歌
        </p>
      </div>
    </div>
  );
};

export default RequestSongPage;
