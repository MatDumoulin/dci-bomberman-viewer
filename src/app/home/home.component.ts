import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'bomberman-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
    serverUrl: string;

    constructor(private _router: Router) {

    }

    joinServer(): void {
      const url = `/game/${this.serverUrl}`;

      this._router.navigateByUrl(url);
    }
}
