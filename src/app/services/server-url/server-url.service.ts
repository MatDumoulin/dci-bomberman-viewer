import { Injectable, OnDestroy } from "@angular/core";
import { Subject, Subscription } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ServerUrlService implements OnDestroy {
    private _serverUrl: string;
    private _changeObservable = new Subject();

    get url(): string {
        return this._serverUrl;
    }

    set url(url: string) {
        console.log("UrlService:", url);
        this._serverUrl = url;
        setTimeout(() =>
            this._changeObservable.next(this._serverUrl)
        );
    }

    ngOnDestroy() {
        this._changeObservable.complete();
    }

    getLeaderboardUrl(): string {
        return "/" + this.url + "/leaderboard";
    }

    getGameUrl(): string {
        return "/" + this.url + "/game";
    }

    onChange(callback: any): Subscription {
        return this._changeObservable.subscribe(callback);
    }
}
