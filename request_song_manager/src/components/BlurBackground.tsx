import defaultCover from "@/assets/images/default_cover.jpg";

interface BlurBackgroundProps {
  imageSrc: string;
}
/**
 * 模糊背景组件
 * @param imageSrc 封面图片url
 * @returns
 */
const BlurBackground = ({ imageSrc }: BlurBackgroundProps) => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${!Boolean(imageSrc) ? defaultCover : imageSrc})`,
        }}
        className="translate-z-0 w-full h-full fixed left-0 top-0 bg-no-repeat bg-cover bg-position-[50%] blur-[65px] opacity-60 bg-white"
      ></div>
      <div className="z-2 w-full h-full fixed left-0 top-0 bg-[rgba(0,0,0,0.5)]"></div>
    </>
  );
};

export default BlurBackground;
