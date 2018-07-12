import { Component } from "@angular/core";
import { NavController, LoadingController } from "ionic-angular";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { HttpClient } from "@angular/common/http";

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
  constructor(
    public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private http: HttpClient,
    public loadingCtrl: LoadingController
  ) {}
  scan() {
    
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        if(barcodeData.cancelled) {
          return;
        }
        this.loading = this.loadingCtrl.create({
          content: "Loading VIN Info...",
          enableBackdropDismiss: true
        });
        this.loading.present();
        const filteredBarcode = this.filterBarCode(barcodeData.text)
        this.barCodeData = filteredBarcode;
        this.getVehicleDetails(filteredBarcode).subscribe(response => {
          this.loading.dismiss();
          this.data = this.filterResponse(response);
        });
      })
      .catch(err => {
        this.data = [];
        this.loading.dismiss();
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
}
