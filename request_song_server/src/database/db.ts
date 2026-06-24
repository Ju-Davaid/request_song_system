import { Sequelize } from "sequelize";
// 初始化数据库连接
const seq = new Sequelize({
    dialect: "sqlite",
    storage: "./music.db",
    logging: false,
});

// 导出数据库连接
export default seq;