import { useImperativeHandle, useState, type FC } from "react";
import { Modal } from "antd";

export interface MyModalExpose {
  show: () => void;
  ok: () => void;
  cancel: () => void;
}

interface MyModalProps {
  ref: React.RefObject<MyModalExpose | null>;
  onOk?: () => void;
  onCancel?: () => void;
  title: string;
  children?: React.ReactNode;
}

const MyModal: FC<MyModalProps> = ({
  ref,
  onOk,
  onCancel,
  title,
  children,
}) => {
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
        title={title}
        closable={false}
        focusable={{
          trap: false,
          focusTriggerAfterClose: true,
        }}
        width={600}
        centered={true}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
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
        {children}
      </Modal>
    </>
  );
};
export default MyModal;
