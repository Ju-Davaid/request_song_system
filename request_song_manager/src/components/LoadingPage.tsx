import animationData from "@/assets/animation/loading.json";
import { useLottie } from "lottie-react";
import loadingBg from "@/assets/images/background.jpeg";
import { motion, AnimatePresence } from "motion/react";
import BlurBackground from "@/components/BlurBackground";

const style = {
  width: "100px",
  height: "100px",
};

interface LoadingPageProps {
  isVisible: boolean;
}

const LoadingPage = ({ isVisible }: LoadingPageProps) => {
  const options = {
    animationData: animationData,
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options, style);
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="w-screen h-screen bg-[#7c756d] fixed top-0 left-0 z-100 flex items-center justify-center"
        >
          {/* 背景层 */}
          <BlurBackground imageSrc={loadingBg} />
          <div className="z-3">{View}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingPage;
