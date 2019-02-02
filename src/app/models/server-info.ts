export class GameInfo {
    id: string;
    serverUrl: string;
    players = 0;
    viewers = 0;
}

export class ServerInfo {
    url = "";
    playerCount = 0;
    gameCount = 0;
    viewerCount = 0;
    games: GameInfo[] = [];
}
