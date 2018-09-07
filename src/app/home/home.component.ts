import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'bomberman-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
    gameUrl: string;

    constructor(private _router: Router) {

    }

    viewGame(): void {
      const url = `/game/${this.gameUrl}`;

      this._router.navigateByUrl(url);
    }
}
