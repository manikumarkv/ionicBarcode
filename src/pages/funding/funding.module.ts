import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FundingPage } from './funding';

@NgModule({
  declarations: [
    FundingPage,
  ],
  imports: [
    IonicPageModule.forChild(FundingPage),
  ],
})
export class FundingPageModule {}
