// 等级图标对象类型
interface QQLevelIcons {
    crownNum: number;
    moonNum: number;
    penguinNum: number;
    starNum: number;
    sunNum: number;
}

// 特权图标对象类型
interface PrivilegeIcons {
    big_club: boolean;
    super: boolean;
    svip: boolean;
    vip: boolean;
    year: boolean;
    years_vip: boolean;
}

// 主体用户数据类型
export interface QQUserInfoVo {
    QQ: string | number;
    user_id: string | number;
    uin: string | number;
    nick: string;
    nickname: string;
    long_nick: string;
    avatar_url: string;
    age: number;
    sex: string;
    qid: string;
    QQ_level: number;
    QQLevel: number;
    QQ_level_icons: QQLevelIcons;
    location: string;
    email: string;
    is_vip: boolean;
    is_years_vip: boolean;
    is_svip: boolean;
    is_big_club: boolean;
    vip_status: number;
    vip_type: number;
    vip_level: number;
    big_club_level: number;
    privilege_icons: PrivilegeIcons;
    reg_time: string;
    regTime: number;
    last_updated: string;
}
