import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import { ToastController } from '@ionic/angular';
import { Ride } from '../model/ride';

@Injectable({
  providedIn: 'root'
})

export class RideService {

  currentBooking: Ride;
  baseUrl = environment.baseUrl + environment.bookingService + environment.bookingBaseApi;

  constructor(private http: HTTP, private toastController: ToastController) {
    this.currentBooking = new Ride();
    http.setDataSerializer('json');
    http.setHeader('*', 'Content-Type', 'application/json');
  }

  async presentToast(msg, duration) {
    const toast = await this.toastController.create({
      message: msg,
      duration
    });
    toast.present();
  }

  updateCurrentLocation(data) {
    console.log('url', this.baseUrl);
    return this.http.post(this.baseUrl, data, {});
  }
}
