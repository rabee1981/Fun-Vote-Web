import { UserInfoService } from './services/userInfo.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { ChartComponent } from "app/component/chart-component/chart-component";
import { AngularFireAuthModule } from "angularfire2/auth";
import { ChartByIdComponent } from './chart-by-id/chart-by-id.component';
import { RouterModule, Routes } from '@angular/router';
import { MenuBarComponent } from "app/component/menu-bar/menu-bar.component";
import { ChartService } from "app/services/chart.service";



export const firebaseConfig = {
    apiKey: "AIzaSyDuFurr7wtx_FFUbmnOMMcxKSOPwtnXKFg",
    authDomain: "funvaotedata.firebaseapp.com",
    databaseURL: "https://funvaotedata.firebaseio.com",
    projectId: "funvaotedata",
    storageBucket: "funvaotedata.appspot.com",
    messagingSenderId: "134302046449"
};

const appRoutes: Routes = [
  { path: 'chart/:id',      component: ChartByIdComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    ChartByIdComponent,
    MenuBarComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  providers: [ChartService,UserInfoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
