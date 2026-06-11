import { create } from "axios";

export const Server = create(
    {
        baseURL: "http://localhost:3000",
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    }
);


export const MusicServer = create({
    baseURL: "http://localhost:3200",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

MusicServer.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);