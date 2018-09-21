import { Injectable } from "@angular/core";
import { GameMap } from "../../models/game-map";
import { GameEngineService } from "../game-engine/game-engine.service";
import { ImageLocation, ObjectType } from "../../models/game-object";
import { OUT_OF_BOUND } from "../../models/tile";

@Injectable({
    providedIn: "root"
})
export class GameMapManagerService {

    constructor(private _gameEngineService: GameEngineService) {}

    // The draw must be performed in a promise since the draw order determines what
    // is displayed on the canvas.
    drawMap(ctx: CanvasRenderingContext2D, gameMap: GameMap): Promise<void> {
        return new Promise((resolve, reject) => {
            // First, we get all of our images. That way, we can assume that all of our images are in memory.
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

                        if (gameMap._tiles[row][col] !== OUT_OF_BOUND) {
                            const tileInfo = gameMap._tiles[row][col].info;

                            if (tileInfo.type === ObjectType.Walkable) {
                                ctx.drawImage(walkableImage, tileInfo.coordinates._x, tileInfo.coordinates._y);
                            }
                            else if (tileInfo.type === ObjectType.BreakableItem) {
                                ctx.drawImage(breakableImage, tileInfo.coordinates._x, tileInfo.coordinates._y);
                            }
                            else if (tileInfo.type === ObjectType.Wall) {
                                ctx.drawImage(wallImage, tileInfo.coordinates._x, tileInfo.coordinates._y);
                            }
                        }
                    }
                }
                resolve();
            })
            .catch(error => reject(error));
        });
    }
}
