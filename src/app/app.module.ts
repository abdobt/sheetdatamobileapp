/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {File} from '@ionic-native/file/ngx';
import { HttpClientModule } from '@angular/common/http';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
@NgModule({
  declarations: [AppComponent,HomeComponent],
  entryComponents: [],
  imports: [FormsModule,HttpClientModule,BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },HttpClient,File,FileOpener],
  bootstrap: [AppComponent],
})
export class AppModule {}
