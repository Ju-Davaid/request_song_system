import { useImperativeHandle, useState } from "react";
import { Modal } from "antd";

export interface StationConfigModalExpose {
  show: () => void;
  ok: () => void;
  cancel: () => void;
}

interface StationConfigModalProps {
  ref: React.RefObject<StationConfigModalExpose>;
  onOk?: () => void;
  onCancel?: () => void;
}

const StationConfigModal = ({
  ref,
  onOk,
  onCancel,
}: StationConfigModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    onOk?.();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    onCancel?.();
  };
  useImperativeHandle(ref, () => ({
    show: showModal,
    ok: handleOk,
    cancel: handleCancel,
  }));

  return (
    <>
      <Modal
        title="点歌台设置"
        closable={false}
        // mask={false}
        width={600}
        centered={true}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="取消"
        okText="确定"
        footer={
          <div className="flex justify-end gap-5">
            <button
              className="min-w-30.5 px-5.75 h-9.5 rounded cursor-pointer hover:bg-[#ededed] hover:text-[#333] transition duration-300 border border-solid border-[#c9c9c9]"
              onClick={handleCancel}
            >
              取消
            </button>
            <button
              className="min-w-30.5 px-5.75 h-9.5 rounded cursor-pointer text-white hover:bg-[#2caf6f] hover:border-[#2caf6f] bg-[#31c27c]  transition duration-300 border border-solid border-[#31c27c]"
              onClick={handleOk}
            >
              确定
            </button>
          </div>
        }
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};
export default StationConfigModal;
