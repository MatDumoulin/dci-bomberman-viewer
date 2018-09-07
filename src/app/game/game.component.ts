import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { SocketService } from "../socket/socket.service";
import { GameEngineService } from "./game-engine/game-engine.service";
import { GameMapManagerService } from "./game-map-manager/game-map-manager.service";
import { GameState } from "../models/game-state";

@Component({
    selector: "bomberman-game",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"]
})
export class GameComponent implements OnInit, OnDestroy {
    private _subscriptions: Subscription[] = [];
    errors: string[] = [];

    constructor(
        private _gameEngineService: GameEngineService,
        private _gameMapManagerService: GameMapManagerService,
        private _route: ActivatedRoute,
        private _socketService: SocketService
    ) {}

    ngOnInit(): void {
        this._subscriptions.push(
            this._socketService.errors.subscribe(errors => {
                if (!errors) {
                    this.errors = [];
                }
                else if (!this.errors.includes(errors)) {
                    this.errors.push(errors);
                }
            })
        );

        const serverUrl = this._route.snapshot.paramMap.get("serverUrl");
        console.log("Server url: ", serverUrl);
        this._socketService.connect(serverUrl).then( () => this.onSocketConnectionSetUp());
    }

    ngOnDestroy(): void {
        this._socketService.disconnect();

        for (const sub of this._subscriptions) {
            sub.unsubscribe();
        }
    }

    onSocketConnectionSetUp(): void {
        this._socketService.on("StateChanged", (gameState: GameState) => {
            this.draw(gameState);
        });
        /* const ctx = this.getCanvasContext();
        this._gameMapManagerService.drawMap(ctx, ); */
    }

    private draw(gameState: GameState): void {
        const ctx = this.getCanvasContext();
        this._gameMapManagerService.drawMap(ctx, gameState.gameMap);
    }

    private getCanvasContext(): CanvasRenderingContext2D {
        const canvas = document.getElementById("bomberman-game") as HTMLCanvasElement;

        if (!canvas || !canvas.getContext) {
            const errorMessage = "Unable to access the game canvas.";
            this.errors.push(errorMessage);
            console.error(errorMessage);
            return null;
        }

        return canvas.getContext('2d');
    }
}
