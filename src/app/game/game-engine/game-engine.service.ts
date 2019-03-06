import { Injectable, OnDestroy } from "@angular/core";

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

            image.onerror = error => {
                reject(error);
            };
        });
    }

    drawSprite(
        ctx: CanvasRenderingContext2D,
        spritesheet: HTMLImageElement,
        positionInGame: {x: number, y: number},
        imageWidth: number,
        imageHeight: number,
        imageCol: number,
        imageRow: number,
        displayWidth: number,
        displayHeight: number,
        paddingTopLeft = 0 // To center the sprite.
    ): void {
        if (ctx) {
            ctx.drawImage(
                spritesheet, // The sprite sheet from which we take our image.
                imageCol * imageWidth + paddingTopLeft, // The x pixel that marks the beggining of our image in the sprite.
                imageRow * imageHeight + +paddingTopLeft, // The y pixel that marks the beggining of our image in the sprite.
                imageWidth, // The width of our image in the sprite.
                imageHeight, // The height of our image in the sprite.
                positionInGame.x, // Where (x pixel) to draw our image in the game.
                positionInGame.y, // Where (y pixel) to draw our image in the game.
                displayWidth, // The width of our image in the game.
                displayHeight // The height of our image in the game.
            );
        }
    }

    drawText(
        text: string,
        ctx: CanvasRenderingContext2D,
        color: string,
        position: {x: number, y: number},
        align: CanvasTextAlign = "center"
    ): void {
        if (ctx) {
            ctx.fillStyle = color;
            ctx.textAlign = align;
            ctx.fillText(text, position.x, position.y);
        }
    }
}
