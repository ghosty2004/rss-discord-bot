export interface playerStats {
    name: string | null;
    online: string | null;
    forumAccount: string | null;
    VIP: string | null;
    admin: string | null;
    money: string | null;
    coins: string | null;
    kills: string | null;
    deaths: string | null;
    onlineTime: string | null;
    driftPoints: string | null;
    racePoints: string | null;
    stuntPoints: string | null;
    respect: string | null;
    properties: string | null;
    gang: string | null;
    gems: string | null;
    statsNote: string | null;
}

export interface gangsList {
    rank: string | null;
    name: string | null;
    points: string | null;
}

export interface guilds {
    id: string | null;
    unBanRequestLog: string | null
}

export interface unBanRequest {
    playerName: string;
    adminName: string;
    linkToPost: string;
}