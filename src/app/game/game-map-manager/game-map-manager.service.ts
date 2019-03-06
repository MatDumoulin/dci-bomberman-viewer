import { Injectable } from "@angular/core";
import { GameMap } from "../../models/game-map";
import { GameEngineService } from "../game-engine/game-engine.service";
import { ImageLocation, ObjectType } from "../../models/game-object";
import { OUT_OF_BOUND } from "../../models/tile";
import { Point } from "../../models/point";
import { GameState } from "src/app/models/game-state";

@Injectable({
    providedIn: "root"
})
export class GameMapManagerService {

    constructor(private _gameEngineService: GameEngineService) {}

    // The draw must be performed in a promise since the draw order determines what
    // is displayed on the canvas.
    drawMap(ctx: CanvasRenderingContext2D, gameMap: GameMap): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!ctx) {
                reject("Context cannot be null");
                return;
            }

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

                            const coordinatesInPixel = {
                                x: tileInfo.coordinates.col * tileInfo.width,
                                y: tileInfo.coordinates.row * tileInfo.height
                            };

                            if (tileInfo.type === ObjectType.Walkable) {
                                ctx.drawImage(walkableImage, coordinatesInPixel.x, coordinatesInPixel.y);
                            }
                            else if (tileInfo.type === ObjectType.BreakableItem) {
                                ctx.drawImage(breakableImage, coordinatesInPixel.x, coordinatesInPixel.y);
                            }
                            else if (tileInfo.type === ObjectType.Wall) {
                                ctx.drawImage(wallImage, coordinatesInPixel.x, coordinatesInPixel.y);
                            }
                        }
                    }
                }
                resolve();
            })
            .catch(error => reject(error));
        });
    }

    drawBombsAndExplosions(ctx: CanvasRenderingContext2D, gameMap: GameMap): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!ctx) {
                reject("Context cannot be null");
                return;
            }

            // First, we get all of our images. That way, we can assume that all of our images are in memory.
            const bombPromise = this._gameEngineService.getImage(ImageLocation.bomb);
            const explosionPromise = this._gameEngineService.getImage(ImageLocation.explosion);

            const allImagesPromise = Promise.all([bombPromise, explosionPromise]);

            // The imagesArray follows the same order as the array used in the Promise.all function.
            allImagesPromise.then(imagesArray => {
                const bombImage = imagesArray[0];
                const explosionImage = imagesArray[1];

                // Drawing all the tiles.
                for (let row = 0; row < gameMap._tiles.length; ++row) {
                    for (let col = 0; col < gameMap._tiles[row].length; ++col) {
                        const tile = gameMap._tiles[row][col];

                        const coordinatesInPixel = {
                            x: tile.info.coordinates.col * tile.info.width,
                            y: tile.info.coordinates.row * tile.info.height
                        };

                        if (tile.bombs.length > 0) {
                            // The + 8 are added since the image is only 16px
                            ctx.drawImage(bombImage, coordinatesInPixel.x + 8, coordinatesInPixel.y + 8);
                        }

                        if (tile.isOnFire) {
                            ctx.drawImage(explosionImage,
                                coordinatesInPixel.x,
                                coordinatesInPixel.y,
                                tile.info.width,
                                tile.info.height
                            );
                        }
                    }
                }
                resolve();
            })
            .catch(error => reject(error));
        });
    }

    drawCollectibles(ctx: CanvasRenderingContext2D, state: GameState): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!ctx) {
                reject("Context cannot be null");
                return;
            }

            // First, we get all of our images. That way, we can assume that all of our images are in memory.
            const powerUpPromise = this._gameEngineService.getImage(ImageLocation.powerUp);
            const bombUpPromise = this._gameEngineService.getImage(ImageLocation.bombUp);
            const speedUpPromise = this._gameEngineService.getImage(ImageLocation.speedUp);

            const allImagesPromise = Promise.all([powerUpPromise, bombUpPromise, speedUpPromise]);

            // The imagesArray follows the same order as the array used in the Promise.all function.
            allImagesPromise.then(imagesArray => {
                const powerUpImage = imagesArray[0];
                const bombUpImage = imagesArray[1];
                const speedUpImage = imagesArray[2];
                let collectibleImage: HTMLImageElement;

                // Drawing all the collectibles.
                for (const collectible of state.collectibles) {
                    if (collectible.type === ObjectType.PowerUp) {
                        collectibleImage = powerUpImage;
                    }
                    else if (collectible.type === ObjectType.BombUp) {
                        collectibleImage = bombUpImage;
                    }
                    else if (collectible.type === ObjectType.SpeedUp) {
                        collectibleImage = speedUpImage;
                    }

                    ctx.drawImage(
                        collectibleImage,
                        collectible.coordinates.col * collectible.width,
                        collectible.coordinates.row * collectible.height
                    );
                }

                resolve();
            })
            .catch(error => reject(error));
        });
    }
}
