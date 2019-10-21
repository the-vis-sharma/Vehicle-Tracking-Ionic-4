import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {Ride} from '../model/ride';
import {RideSocketService} from '../service/ride-socket.service';
import {RideService} from '../service/ride.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {

  ride: Ride;

  public items: Array<{ lng: number; lat: number; timeStamp: Date}> = [];
  constructor(private geolocation: Geolocation, private route: ActivatedRoute,
              private router: Router, private websocketService: RideSocketService, private rideService: RideService) {
    this.route.queryParams.subscribe(params => {
      const state = this.router.getCurrentNavigation().extras.state;
      if (state) {
        this.ride = state.ride;
      }
    });
  }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log('lng, lng', resp.coords.latitude, resp.coords.longitude);
      this.items.push({
        lng: resp.coords.longitude,
        lat: resp.coords.latitude,
        timeStamp: new Date()
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    const watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      console.log('changed lat, lng', data.coords.latitude, data.coords.longitude);
      this.items.push({
        lng: data.coords.longitude,
        lat: data.coords.latitude,
        timeStamp: new Date()
      });

      // call location update api here
    });

    this.websocketService.connect().then((result) => {
      console.log('Connected');
      this.websocketService.subscribeTopic('/topic/end-ride/' + this.ride._id).subscribe((message) => {
        console.log('data from socket: ', message);
        if (message && message.status === 'Ended') {
          this.rideService.presentToast('Ride is ended', 2000);
          this.router.navigateByUrl('');
        } else {
          this.rideService.presentToast('Something went wrong', 2000);
        }
      });
    }).catch((error) => {
      console.error('Failed to connect');
      this.rideService.presentToast('Failed to connect with server', 2000);
    });
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
