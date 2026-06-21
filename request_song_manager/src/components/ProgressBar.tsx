import { useState, type FC, useRef, useEffect, useCallback } from "react";
interface ProgressBarProps {
  value?: number;
  className?: string;
  onChange?: (value: number) => void;
  onChangeComplete?: (value: number) => void;
}

const ProgressBar: FC<ProgressBarProps> = ({
  value = 0,
  className = "",
  onChange,
  onChangeComplete,
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const [internalProgress, setInternalProgress] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  // 同步外部 value（拖拽时不更新）
  useEffect(() => {
    if (!isDragging) {
      setInternalProgress(value);
    }
  }, [value, isDragging]);

  // 更新进度并触发 onChange
  const updateProgress = useCallback(
    (clientX: number) => {
      if (!progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const newProgress = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100),
      );
      setInternalProgress(newProgress);
      onChange?.(newProgress);
    },
    [onChange],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateProgress(e.clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateProgress(e.clientX);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        onChangeComplete?.(internalProgress);
      }
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, internalProgress, onChangeComplete, updateProgress]);

  return (
    <div className={`w-full ${className}`}>
      {/* 进度条容器 */}
      <div
        ref={progressRef}
        className="relative h-1 bg-[#ffffff1a] rounded-full cursor-pointer group"
        onMouseDown={handleMouseDown}
      >
        {/* 已播放进度 */}
        <div
          className="absolute top-0 left-0 h-full bg-white rounded-full"
          style={{ width: `${internalProgress}%` }}
        />

        {/* 滑块 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${internalProgress}% - 6px)` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
