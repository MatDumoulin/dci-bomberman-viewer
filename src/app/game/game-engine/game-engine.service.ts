import { Injectable, OnDestroy } from "@angular/core";
import { promise } from "protractor";

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

            image.onerror = () => {
                reject();
            };
        });
    }
}
