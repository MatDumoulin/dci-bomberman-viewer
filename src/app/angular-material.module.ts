import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatInputModule, MatToolbarModule } from '@angular/material';

@NgModule({
  declarations: [
  ],
  exports: [
    BrowserAnimationsModule, // To enable animations for angular-material.
    MatButtonModule,
    MatInputModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: []
})
export class AngularMaterialModule { }
