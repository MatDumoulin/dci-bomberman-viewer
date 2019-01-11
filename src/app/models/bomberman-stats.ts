export interface Stat {
    [playerId: string]: number;
}

export class BombermanStats {
    winner: Stat;
    kills: Stat;
}
