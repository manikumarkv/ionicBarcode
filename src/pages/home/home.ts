import { Component } from "@angular/core";
import { NavController, LoadingController } from "ionic-angular";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "page-home",
  templateUrl: "home.html",
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
        this.barCodeData = barcodeData;
        console.log(JSON.stringify(barcodeData));
        this.loading = this.loadingCtrl.create({
          content: "Loading VIN Info...",
          enableBackdropDismiss: true
        });
        this.loading.present();
        this.getVehicleDetails(barcodeData.text).subscribe(response => {
          this.loading.dismiss();
          console.log("success");
          this.testData = JSON.stringify(response);          
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
}
