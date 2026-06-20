import emptyImage from "@/assets/images/empty.webp";
const Empty = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <img
        draggable={false}
        src={emptyImage}
        alt="暂无数据"
        className="object-cover block"
      />
      <div className="mt-2 text-white text-sm opacity-50">播放列表为空</div>
    </div>
  );
};
export default Empty;
