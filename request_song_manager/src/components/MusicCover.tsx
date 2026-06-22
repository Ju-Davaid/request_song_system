import { memo } from "react";
import { Image } from "antd";
import defaultCover from "@/assets/images/default_cover.jpg";
import { motion } from "motion/react";

interface MusicCoverProps {
  src: string;
  width: number;
  height: number;
  // 原始元素坐标 DOMRect
  position?: DOMRect;
  // 是否圆形封面
  isRounded?: boolean;
  className?: string;
}

const MusicCover = memo<MusicCoverProps>(
  ({ src, width, height, position, isRounded, className }) => {
    const originX = position?.x ?? 0;
    const originY = position?.y ?? 0;

    return (
      <motion.div
        layoutId="music-cover"
        layout
        className={`fixed z-3 overflow-hidden ${className ?? ""}`}
        style={{
          width,
          height,
        }}
        animate={{
          left: originX,
          top: originY,
          borderRadius: isRounded ? "50%" : "8px",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <Image
          width="100%"
          height="100%"
          preview={false}
          src={src}
          fallback={defaultCover}
          style={{
            objectFit: "cover",
            display: "block",
          }}
        />
      </motion.div>
    );
  },
  (prev, next) => {
    if (
      prev.src !== next.src ||
      prev.width !== next.width ||
      prev.height !== next.height ||
      prev.isRounded !== next.isRounded ||
      prev.className !== next.className
    ) {
      return false;
    }
    const prevPos = prev.position;
    const nextPos = next.position;
    if (!prevPos && !nextPos) return true;
    if (!prevPos || !nextPos) return false;
    return prevPos.x === nextPos.x && prevPos.y === nextPos.y;
  },
);

export default MusicCover;
