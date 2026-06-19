import animationData from "@/assets/animation/loading.json";
import { useLottie } from "lottie-react";
import loadingBg from "@/assets/images/background.jpeg";

const style = {
  width: "100px",
  height: "100px",
};

const LoadingPage = () => {
  const options = {
    animationData: animationData,
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options, style);
  return (
    <div className="w-screen h-screen bg-[#7c756d] fixed top-0 left-0 z-10 flex items-center justify-center">
      {/* 背景层 */}
      <div
        style={{
          backgroundImage: `url(${loadingBg})`,
        }}
        className="translate-z-0 w-full h-full fixed left-0 top-0 bg-no-repeat bg-cover bg-position-[50%] blur-[65px] opacity-60 bg-white"
      ></div>
      {/* 遮罩层 */}
      <div className="z-2 w-full h-full fixed left-0 top-0 bg-[rgba(0,0,0,0.35)]"></div>
      <div className="z-3">{View}</div>
    </div>
  );
};

export default LoadingPage;
