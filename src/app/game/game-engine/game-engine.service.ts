import { Injectable, OnDestroy } from "@angular/core";
import { Point } from "../../models/point";

@Injectable({
    providedIn: "root"
})
export class GameEngineService implements OnDestroy {
    private _imageCache = new Map<string, HTMLImageElement>();

    constructor() {}

    ngOnDestroy(): void {
        this._imageCache.clear();
    }

    /**
     * Loads an image into memory. If the image is already in memory,
     * it instantly resolves.
     */
    getImage(imageUrl: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            // If the image is already in cache, resolve right away.
            if (this._imageCache.has(imageUrl)) {
                resolve(this._imageCache.get(imageUrl));
                return;
            }

            // Else, load it.
            const image = new Image();
            image.src = imageUrl;

            image.onload = () => {
                this._imageCache.set(imageUrl, image);
                resolve(image);
            };

            image.onerror = (error) => {
                reject(error);
            };
        });
    }

    drawSprite(
        ctx: CanvasRenderingContext2D,
        spritesheet: HTMLImageElement,
        positionInGame: Point,
        imageWidth: number,
        imageHeight: number,
        imageCol: number,
        imageRow: number,
        displayWidth: number,
        displayHeight: number,
        paddingTopLeft = 0 // To center the sprite.
    ): void {
        ctx.drawImage(
            spritesheet, // The sprite sheet from which we take our image.
            imageCol * imageWidth + paddingTopLeft, // The x pixel that marks the beggining of our image in the sprite.
            imageRow * imageHeight + + paddingTopLeft, // The y pixel that marks the beggining of our image in the sprite.
            imageWidth, // The width of our image in the sprite.
            imageHeight, // The height of our image in the sprite.
            positionInGame._x, // Where (x pixel) to draw our image in the game.
            positionInGame._y, // Where (y pixel) to draw our image in the game.
            displayWidth, // The width of our image in the game.
            displayHeight // The height of our image in the game.
        );
    }

    drawText(text: string, ctx: CanvasRenderingContext2D, color: string, position: Point, align: CanvasTextAlign = "center"): void {
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.fillText(text, position._x, position._y);
    }
}
