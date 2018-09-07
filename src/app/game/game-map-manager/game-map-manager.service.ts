import { Injectable } from "@angular/core";
import { GameMap } from "../../models/game-map";
import { GameEngineService } from "../game-engine/game-engine.service";
import { ImageLocation, ObjectType } from "../../models/game-object";

@Injectable({
    providedIn: "root"
})
export class GameMapManagerService {

    constructor(private _gameEngineService: GameEngineService) {}

    drawMap(ctx: CanvasRenderingContext2D, gameMap: GameMap) {
        // First, we get all of our images.
        const breakablePromise = this._gameEngineService.getImage(ImageLocation.breakable);
        const walkablePromise = this._gameEngineService.getImage(ImageLocation.walkable);
        const wallPromise = this._gameEngineService.getImage(ImageLocation.wall);
        const allImagesPromise = Promise.all([breakablePromise, walkablePromise, wallPromise]);

        // The imagesArray follows the same order as the array used in the Promise.all function.
        allImagesPromise.then(imagesArray => {
            const breakableImage = imagesArray[0];
            const walkableImage = imagesArray[1];
            const wallImage = imagesArray[2];

            // Drawing all the tiles.
            for (let row = 0; row < gameMap._tiles.length; ++row) {
                for (let col = 0; col < gameMap._tiles[row].length; ++col) {
                    const posX = col * gameMap._tileWidth;
                    const posY = row * gameMap._tileHeight;

                    if (gameMap._tiles[row][col].type === ObjectType.Walkable) {
                        ctx.drawImage(walkableImage, posX, posY);
                    }
                    else if (gameMap._tiles[row][col].type === ObjectType.BreakableItem) {
                        ctx.drawImage(breakableImage, posX, posY);
                    }
                    else if (gameMap._tiles[row][col].type === ObjectType.Wall) {
                        ctx.drawImage(wallImage, posX, posY);
                    }
                }
            }
        });
    }
}
