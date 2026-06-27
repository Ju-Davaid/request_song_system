import http from 'http';
import { Server as WebSocketServer } from 'socket.io';
import { MusicListDB } from '../database';
import getMusicInfoByName from '../utils/getMusicInfoByName';
import { MusicVo } from '../entity/vo/MusicVo';
import { SocketRoleEnum, ValidRoleList } from '../entity/enum/SocketRoleEnum';

const MusicList = MusicListDB.getInstance();

const initSocketServer = (server: http.Server) => {
  // 角色 -> 该角色所有在线socketId集合（Set方便去重删除）
  const SOCKET_MAP = new Map<SocketRoleEnum, Set<string>>();
  // socketId -> 当前绑定角色
  const ROLE_MAP = new Map<string, SocketRoleEnum>();

  const socketServer = new WebSocketServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  socketServer.on('connection', (socket) => {
    console.log('Client connected', socket.id);

    // 绑定/切换角色
    socket.on("bind_role", (data: { role: SocketRoleEnum }) => {
      const { role } = data;
      if (!ValidRoleList.includes(role)) {
        socket.emit('bind_role', { success: false, message: '角色无效' });
        return;
      }
      console.log('收到用户绑定角色请求:', data, socket.id);

      // 1. 如果该socket之前绑定过角色，先从旧角色集合移除
      const oldRole = ROLE_MAP.get(socket.id);
      if (oldRole) {
        const oldSet = SOCKET_MAP.get(oldRole);
        oldSet?.delete(socket.id);
        // 集合空了就删掉key，减少遍历
        if (oldSet?.size === 0) SOCKET_MAP.delete(oldRole);
      }

      // 2. 新增/切换到新角色
      if (!SOCKET_MAP.has(role)) {
        SOCKET_MAP.set(role, new Set());
      }
      SOCKET_MAP.get(role)!.add(socket.id);
      ROLE_MAP.set(socket.id, role);

      socket.emit('bind_role', { success: true });
    });

    // 点歌事件
    socket.on('request_song', async (data: { songName: string }) => {
      try {
        const res = await getMusicInfoByName(data.songName);
        console.log('收到用户点歌请求:', data);
        if (res.getCode() === 200) {
          const songInfo: MusicVo = res.getData() as MusicVo;
          MusicList.upsertMusic(songInfo);

          // 获取所有管理员socket
          const adminSocketSet = SOCKET_MAP.get(SocketRoleEnum.ADMIN);
          if (!adminSocketSet || adminSocketSet.size === 0) {
            console.log("当前无在线管理员，不推送点歌");
            return;
          }
          // 遍历推送给每一个管理员
          adminSocketSet.forEach((socketId) => {
            socketServer.to(socketId).emit('receive_song', songInfo);
          });
        }
      } catch (err) {
        console.error("点歌接口异常", err);
      }
    });

    // 断开连接清理映射
    socket.on('disconnect', () => {
      const role = ROLE_MAP.get(socket.id);
      console.log('Client disconnected', socket.id, role);
      if (!role) return;

      // 从对应角色Set删除当前socket
      const socketSet = SOCKET_MAP.get(role);
      socketSet?.delete(socket.id);
      // 集合空则移除map键
      if (socketSet?.size === 0) SOCKET_MAP.delete(role);

      ROLE_MAP.delete(socket.id);
    });
  });

  return socketServer;
};

export default initSocketServer;