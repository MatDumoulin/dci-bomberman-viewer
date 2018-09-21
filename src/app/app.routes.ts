import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GameComponent } from "./game/game.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { HomeComponent } from "./home/home.component";

// Route Configuration
export const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "game/:serverUrl", component: GameComponent}
    // { path: "**", component: NotFoundComponent }
];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);