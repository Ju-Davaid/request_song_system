import { create } from "axios";


export const Server = create(
    {
        baseURL: "http://localhost:3000/api",
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
    }
);

Server.interceptors.request.use(
    (config) => {
        const info = localStorage.getItem("userInfo");
        const userInfo = info ? JSON.parse(info) as any : null;
        if (userInfo) {
            console.log(userInfo);
            config.headers["X-Custom-Cookie"] = userInfo.cookie;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器，返回 data 字段
Server.interceptors.response.use(
    (response) => response.data,
    (err) => Promise.reject(err)
);