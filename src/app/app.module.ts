import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideHttpClient(), FileOpener,BluetoothLE, BluetoothSerial],
  bootstrap: [AppComponent],
})
export class AppModule {}
