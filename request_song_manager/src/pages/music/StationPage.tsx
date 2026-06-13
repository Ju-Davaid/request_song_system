import stationBg from "@/assets/images/station_bg.webp";
const StationPage = () => {
  return (
    <div className="relative w-screen min-h-screen bg-[#292a2b]">
      {/* 背景层 */}
      <div
        style={{
          backgroundImage: `url(${stationBg})`,
        }}
        className="z-1 w-full h-full fixed left-0 top-0 bg-no-repeat bg-cover bg-center blur-[65px] opacity-60 bg-white"
      ></div>
      {/* 遮罩层 */}
      <div className="z-2 w-full h-full fixed left-0 top-0 bg-[rgba(0,0,0,0.35)]"></div>
      {/* 内容层 */}
      <main className="z-3 w-full h-full fixed left-0 top-0">
        <header className="flex p-5 justify-between items-center text-white opacity-30">
          {/* 标题 */}
          <div className="text-2xl font-[HuaWenFont]">
            老友会点歌台
          </div>
          {/* 用户信息 */}
          <div className="">PIONEER.JU</div>
        </header>
      </main>
    </div>
  );
};
export default StationPage;
