import { QRCode } from "antd";

const LoginPage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <div className="w-96 h-96 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold">请使用QQ二维码登录</div>
        <div className="text-lg mb-2">扫描QQ二维码即可登录</div>
        <QRCode
          type="svg"
          size={200}
          value="https://ant.design/"
          icon="/images/QQ.jfif"
        />
      </div>
    </div>
  );
};

export default LoginPage;
