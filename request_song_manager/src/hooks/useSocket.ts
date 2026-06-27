import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import useMessage from "@/hooks/useMessage";
import type { MusicVo } from "@/types/Music";
import { SocketRoleEnum } from "@/enum/SocketRoleEnum";
import usePlayerStore from "@/store/player.store";
interface SocketConnectProps {
    role?: SocketRoleEnum;
}
const useSocket = ({ role = SocketRoleEnum.USER }: SocketConnectProps) => {
    const { message } = useMessage();
    const mode = import.meta.env.MODE;
    const isDev = mode === "development";
    const addMusic = usePlayerStore((state) => state.addMusic);

    const socketRef = useRef<Socket | null>(null);

    if (!socketRef.current) {
        const socketUrl = isDev
            ? "http://127.0.0.1:3000"
            : "/";

        socketRef.current = io(socketUrl, {
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
    }

    const socket = socketRef.current;

    // 连接成功
    const handleConnect = useCallback(() => {
        message.success("socket 连接成功");
        console.log("socket已连接，id：", socket?.id);
        socket?.emit("bind_role", { role });
    }, [message, socket, role]);

    // 断开
    const handleDisconnect = useCallback((reason: string) => {
        message.warning(`连接断开，原因：${reason}`);
    }, [message]);

    // 连接失败
    const handleConnectError = useCallback((err: Error) => {
        message.error(`socket 连接失败：${err.message}`);
        console.error("连接报错详情：", err);
    }, [message]);

    // 重连成功
    const handleReconnect = useCallback(() => {
        message.success("socket 重连成功");
    }, [message]);

    // 接收点歌回调
    const receiveSong = useCallback((music: MusicVo) => {
        message.success(`收到点歌：《${music.name}》`);
        console.log("客户端收到 receive_song：", music);
        addMusic(music);
    }, [message, addMusic]);

    useEffect(() => {
        if (!socket) return;

        // 绑定全部事件
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);
        socket.on("reconnect", handleReconnect);
        socket.on("receive_song", receiveSong);
        socket.connect();

        // 清理函数 - 仅在组件卸载时执行
        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.off("reconnect", handleReconnect);
            socket.off("receive_song", receiveSong);
            socket.disconnect();
        };
        // 依赖只放稳定回调，socket 是ref不变无需加入
    }, [handleConnect, handleDisconnect, handleConnectError, handleReconnect, receiveSong]);

    // 发送点歌请求
    const requestSong = useCallback((songName: string) => {
        if (!socket?.connected) {
            message.error("socket 未连接，发送失败");
            return;
        }
        console.log("发送 request_song：", songName);
        socket.emit("request_song", { songName });
    }, [socket, message]);

    return {
        socket,
        requestSong,
    };
};

export default useSocket;