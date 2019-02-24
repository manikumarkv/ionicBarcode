import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import Rekognition  from 'node-rekognition'

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
    this.rekognition = new Rekognition(this.getVinNumberByImage)
  }

  getVinNumber(convertedImage: string) {
    return this.http.post(
      "https://9see8x7od6.execute-api.us-east-2.amazonaws.com/default/ImageToVINFunction",
      { key1: convertedImage },
      { responseType: "text" }
    );
  }

  getVinNumberByImage(imageData: any) {
    const options = {
      headers: new HttpHeaders({
        Accept: "application/json",
        "cache-control": "no-cache",
        "Postman-Token": "b992e4d0-c2cc-4a78-bc4f-df878921ab4c"
        // "Content-Type":
      })
    };
    return this.http.post(
      "http://vickytripathy.in:3000/detect_text",
      imageData,
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
      "https://9see8x7od6.execute-api.us-east-2.amazonaws.com/default/ImageToVINFunction",
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
    const s3Images = await this.rekognition.uploadToS3(ua, "folder")
    const imageLabels = await this.rekognition.detectLabels(s3Images)
    return imageLabels;
  }

  
}
