import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AngularMaterialModule } from './angular-material.module';
import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { RoomListComponent } from './room-list/room-list.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { GameScreenComponent } from './game/game-screen/game-screen.component';
import { ClockComponent } from './game/clock/clock.component';


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    NotFoundComponent,
    HomeComponent,
    RoomListComponent,
    LeaderboardComponent,
    ToolbarComponent,
    GameScreenComponent,
    ClockComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    AngularMaterialModule,
    routing,
    NgxChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
