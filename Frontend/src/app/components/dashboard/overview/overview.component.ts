import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axios from 'axios';

import { PRIVATE_URI } from 'src/app/constant/static';
import { authorization, getItem } from 'src/app/utils/helper';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  private hubConnectionBuilder!: HubConnection;

  user_email = getItem('user_email');

  totalAssets: number = 0;
  assets: number = 0;
  count: number = 0;
  latitude: number = 0;
  longitude: number = 0;

  constructor( ) {
  }

  async ngOnInit() {
    let totalAmount: number = 0
    let tankCount: number = 0;
    let latitude: number = 0;
    let longitude: number = 0;

    const header = authorization();

    await axios.post(`${PRIVATE_URI}TotalAsset/${this.user_email}`,{}, header).then (function(res) {
      totalAmount = res.data.totalAmount;
      tankCount = res.data.count;
      latitude = res.data.latitude;
      longitude = res.data.longitude;
    }).catch(function(error) {
      console.log(error)
    })

    this.totalAssets = totalAmount;
    this.assets = totalAmount;
    this.count = tankCount;
    this.latitude = latitude;
    this.longitude = longitude;
    this.initWebSocket()
  }

  async initWebSocket(): Promise<void> {

    this.hubConnectionBuilder = new HubConnectionBuilder()
      .withUrl('https://10.10.18.211:5001/commands')
      .configureLogging(LogLevel.Information)
      .build();
    this.hubConnectionBuilder
      .start()
      .then(() => console.log('Connection started.......!'))
      .catch(err => console.log('Error while connect with server'));

    this.hubConnectionBuilder.on('SendTotalAsset', (data: any) => {
      if(this.user_email !== 'admin') {
        this.assets = data.totalAmount;
        this.count = data.count;
        this.totalAssets += (data.totalAmount - this.assets);
        console.log(this.totalAssets)
      }
    });

  }
}
