import { Component } from "@angular/core";
import {
  NavController,
  LoadingController,
  ToastController,
  // NavParams
} from "ionic-angular";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { HttpClient } from "@angular/common/http";
// import { FundingPage } from './funding/funding';
import { FundingPage } from '../funding/funding';
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  barCodeData = {
    text: null
  };
  data: Array<any> = [];
  testData: string = "";
  loading: any = null;
  vinRawResponse: any = {};
  constructor(
    public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private http: HttpClient,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {}
  scan() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        if (barcodeData.cancelled) {
          return;
        }
        this.loading = this.loadingCtrl.create({
          content: "Loading VIN Info...",
          enableBackdropDismiss: true
        });
        this.loading.present();
        const filteredBarcode = this.filterBarCode(barcodeData.text);
        this.barCodeData = filteredBarcode;
        this.getVehicleDetails(filteredBarcode).subscribe(response => {
          this.loading.dismiss();
          this.data = this.filterResponse(response);
          this.vinRawResponse = response;
        });
      })
      .catch(err => {
        this.data = [];
        //this.loading.dismiss();
        alert("something went wrong. Please try again");
      });
  }
  geturl(vinNumber) {
    return (
      "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/" +
      vinNumber +
      "?format=json"
    );
  }
  getVehicleDetails(vinNumber) {
    const url = this.geturl(vinNumber);
    console.log(url);
    return this.http.get(url);
  }
  saveInfo(vinInfo) {
    // const url = 'https://680zjdkcvd.execute-api.us-east-1.amazonaws.com/latest/poc';
    const url =
      "https://680zjdkcvd.execute-api.us-east-1.amazonaws.com/latest/poc/post";
      vinInfo.Results.map(vin=> {
        if(vin.Value == ''){
          vin.Value = null
        }
        if(vin.ValueId == ''){
          vin.ValueId = null
        }
        if(vin.Variable == ''){
          vin.Variable = null
        }
        if(vin.VariableId == ''){
          vin.VariableId = null
        }
      })
    const body = {
      'data': vinInfo
    };
    return this.http.post(url, body);
  }
  filterResponse(result) {
    console.log("result in");
    let resultData = [];
    const paramIds = [26, 27, 28, 29, 39];
    resultData = result.Results.filter(param => {
      return paramIds.indexOf(param.VariableId) > -1;
    });
    console.log(JSON.stringify(resultData));
    return resultData;
  }
  filterBarCode(barCodetext) {
    if (barCodetext.length == 17) {
    } else if (barCodetext.length == 18) {
      barCodetext = barCodetext.slice(1);
    } else if (barCodetext.length == 19) {
      barCodetext = barCodetext.slice(1);
      barCodetext = barCodetext.slice(0, -1);
    } else if (barCodetext.length == 20) {
      barCodetext = barCodetext.slice(2);
      barCodetext = barCodetext.slice(0, -1);
    }
    return barCodetext;
  }

  save() {
    this.loading = this.loadingCtrl.create({
      content: "Saving VIN Info...",
      enableBackdropDismiss: true
    });
    this.loading.present();
    this.saveInfo(this.vinRawResponse).subscribe(
      response => {
        this.loading.dismiss();
        this.vinRawResponse = {};
        this.data = [];
        this.barCodeData = { text: null };
        const toast = this.toastCtrl.create({
          message: "VIN Information saved successfully",
          duration: 3000
        });
        toast.present();
        this.navigateToFunding();
      },
      err => {
        this.loading.dismiss();
        alert(err.message);
      }
    );
   }

  navigateToFunding() {
    //alert(1)
    this.navCtrl.push(FundingPage)
  }
}
