import playerIcon1x from "@/assets/images/play_icon_1x.png";
import playerIcon2x from "@/assets/images/player_icon_2x.png";
import { memo } from "react";

interface SpiritButtonProps {
  width?: number;
  height?: number;
  position: number[];
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}
/**
 * 精灵按钮组件
 * @param width 精灵按钮宽度
 * @param height 精灵按钮高度
 * @param position 精灵按钮位置
 * @param className 精灵按钮自定义类名
 * @returns 精灵按钮组件
 */
const SpiritButton = memo<SpiritButtonProps>(
  ({
    width = 20,
    height = 20,
    position: [x, y],
    className = "",
    onClick,
    disabled = false,
  }) => {
    return (
      <button
        disabled={disabled}
        onClick={() => onClick?.()}
        className={`${disabled ? "cursor-not-allowed" : "cursor-pointer"} opacity-80 hover:opacity-100 transition-opacity duration-300 ${className}`}
        style={{
          backgroundImage: ` image-set(url(${playerIcon1x}) 1x,url(${playerIcon2x}) 2x)`,
          backgroundPosition: `${x}px ${y}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      ></button>
    );
  },
);

export default SpiritButton;
