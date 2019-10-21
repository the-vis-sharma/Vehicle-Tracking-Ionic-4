import {Component, OnInit} from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {RideSocketService} from '../service/ride-socket.service';
import {RideService} from '../service/ride.service';
import {NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  vehicleNumber = null;
  createdCode = null;

  constructor(private websocketService: RideSocketService, private rideService: RideService, private router: Router) {
  }

  createCode() {
    this.createdCode = this.vehicleNumber;
  }

  ngOnInit(): void {
    this.websocketService.connect().then((result) => {
      console.log('Connected');
      this.websocketService.subscribeTopic('/topic/ride-started/' + this.vehicleNumber).subscribe((message) => {
        console.log('data from socket: ', message);
        if (message && message.status === 'OK') {
          this.rideService.presentToast('Ride is started for ride id: ' + message.data._id, 2000);
          const extras: NavigationExtras = {
            state: {
              ride: message.data
            }
          };
          this.router.navigateByUrl('list', extras);
        } else {
          this.rideService.presentToast('Something went wrong', 2000);
        }
      });
    }).catch((error) => {
      console.error('Failed to connect');
      this.rideService.presentToast('Failed to connect with server', 2000);
    });
  }



}
