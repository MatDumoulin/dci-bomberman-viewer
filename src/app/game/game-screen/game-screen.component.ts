import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { GameState, PlayerId } from "src/app/models";
import { GameMapManagerService } from "../game-map-manager/game-map-manager.service";
import { PlayerManagerService } from "../player-manager/player-manager.service";

@Component({
    selector: "bomberman-game-screen",
    templateUrl: "./game-screen.component.html",
    styleUrls: ["./game-screen.component.css"]
})
export class GameScreenComponent implements OnInit {

    @Input()
    set state(state: GameState) {
        if (state) {
            this.draw(state);
        }
        else {
            this.clearCanvas();
        }
    }

    @Output()
    userAction = new EventEmitter();

    constructor(private _gameMapManagerService: GameMapManagerService,
        private _playerManagerService: PlayerManagerService) {}


    ngOnInit() {}


    private async draw(state: GameState): Promise<void> {
        // First of, we clear the canvas.
        this.clearCanvas();
        // Then, we draw our current state.
        const ctx = this.getCanvasContext();
        // Awaits and promises are used since the draw order determines the z-index on the canvas.
        // Thus, we got to keep a clear draw order.
        await this._gameMapManagerService.drawMap(ctx, state.gameMap);
        await this._gameMapManagerService.drawCollectibles(ctx, state);
        await this._gameMapManagerService.drawBombsAndExplosions(
            ctx,
            state.gameMap
        );

        const playerIds = Object.keys(state.players);

        for (let i = 0; i < playerIds.length; ++i) {
            const player = state.players[playerIds[i]];

            if (player.isAlive) {
                await this._playerManagerService.drawPlayer(ctx, player, state.gameMap);
            }
        }

        if(state.isOver) {
            if (state.winner) {
                this.drawWinnerScreen(state.winner);
            }
            else {
                this.drawNoWinnerScreen();
            }

        }

    }


    private clearCanvas(): void {
        const canvas = this.getCanvas();
        const ctx = this.getCanvasContext();

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    private getCanvasContext(): CanvasRenderingContext2D {
        const canvas = this.getCanvas();

        if (!canvas || !canvas.getContext) {
            console.error("Unable to access the game canvas.");
            return null;
        }

        return canvas.getContext("2d");
    }

    private getCanvas(): HTMLCanvasElement {
        return document.getElementById("bomberman-game") as HTMLCanvasElement;
    }

    private drawWinnerScreen(playerId: PlayerId) {
        const ctx = this.getCanvasContext();
        const canvas = this.getCanvas();

        if (ctx) {
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;

            ctx.font = "24px Marker Felt, fantasy";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(
                `Player ${playerId} has won!`,
                canvas.width / 2,
                150,
                canvas.width
            );
        }
    }

    private drawNoWinnerScreen() {
        const ctx = this.getCanvasContext();
        const canvas = this.getCanvas();

        if (ctx) {
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;

            ctx.font = "24px Marker Felt, fantasy";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(
                `It's a draw, scrub :)`,
                canvas.width / 2,
                150,
                canvas.width
            );

            ctx.fillText(
                `Seriously, try killing others next time...`,
                canvas.width / 2,
                200,
                canvas.width
            );
        }
    }
}
