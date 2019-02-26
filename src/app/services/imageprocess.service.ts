import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import Rekognition  from 'node-rekognition'
// import { HTTP } from '@ionic-native/http/ngx';

@Injectable()
export class ImageProcessService {
  private AWSParameters = {
    accessKeyId: "AKIAJMNUGYVQEEUDT2JA",
    secretAccessKey: "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",
    region: "us-west-2",
    bucket: "nasonlinetest",
    ACL: "authenticated-read" // optional
  };
  private rekognition = null;
  constructor(public http: HttpClient) {
    // this.rekognition = new Rekognition(this.getVinNumberByImage)
  }

  getVinNumber(convertedImage: string) {
    //convertedImage = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHA";
    return this.http.post(
      // "https://9see8x7od6.execute-api.us-east-2.amazonaws.com/default/ImageToVINFunction",
      "https://u9vtqx0hdb.execute-api.us-east-2.amazonaws.com/default/testFunction",
      { key1: convertedImage },
      { responseType: "text" }
    );
  }

  getVinNumberByImage(imageData: any) {
    //imageData =""
    const options = {
      headers: new HttpHeaders({
        Accept: "application/json",
        "Content-Type": "application/json"
        // "cache-control": "no-cache",
        // "Postman-Token": "b992e4d0-c2cc-4a78-bc4f-df878921ab4c"
        // "Content-Type":
      })
    };
    return this.http.post(
      "http://vickytripathy.in:3000/detect_text_encoded",
      { file: imageData },
      options
    );
  }
  getVin1(convertedImage: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "content-length": "247"
      }),
      responseType: "text"
    };
    return this.http.post(
      //"https://9see8x7od6.execute-api.us-east-2.amazonaws.com/default/ImageToVINFunction",
      "https://u9vtqx0hdb.execute-api.us-east-2.amazonaws.com/default/testFunction",
      { key1: convertedImage },
      { responseType: "text" }
    );
  }

  async getVin2(image: string) {
    var length = image.length;
    let imageBytes = new ArrayBuffer(length);
    var ua = new Uint8Array(imageBytes);
    for (var i = 0; i < length; i++) {
      ua[i] = image.charCodeAt(i);
    }
    const s3Images = await this.rekognition.uploadToS3(ua, "folder");
    const imageLabels = await this.rekognition.detectLabels(s3Images);
    return imageLabels;
  }

  getVin(detectedText: any) {
    let detectedTextResult = "";
    if (detectedText.TextDetections !== undefined) {      
      detectedText.TextDetections.map(text => {
        if (text.DetectedText !== '') {
          const currencyRegex = /^[a-zA-Z0-9]{17}$/;
          if(currencyRegex.test(text.DetectedText)){
            detectedTextResult = text.DetectedText
          }
        }
      });
    } else {
      return "";
    }
    return detectedTextResult
  }
}
