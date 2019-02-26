import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { Camera } from '@ionic-native/camera';
//import { HTTP } from '@ionic-native/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { FundingPage } from '../pages/funding/funding';
import { ImageProcessService } from '../app/services/imageprocess.service';
// import { HTTP } from '@ionic-native/http/ngx';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    FundingPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    //HTTP,
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    FundingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    Camera,
    // HTTP,
    ImageProcessService
  ]
})
export class AppModule {}
