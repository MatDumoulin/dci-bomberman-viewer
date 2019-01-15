export class Stat {
    name: string;
    value: number;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}

export class BombermanStats {
    winner: Stat[] = [];
    kills: Stat[] = [];
}

export interface BombermanRoomStats {
    winner: { [playerId: string]: number };
    kills: { [playerId: string]: number };
}
