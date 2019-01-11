import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class ImageProcessService {
  constructor(public http: HttpClient) {}

  getVinNumber(convertedImage: string) {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        }),
        responseType: 'text'
      };
    return this.http.post(
      "https://9see8x7od6.execute-api.us-east-2.amazonaws.com/default/ImageToVINFunction",
      { key1: convertedImage }, {responseType: 'text'},
    );
  }
}
