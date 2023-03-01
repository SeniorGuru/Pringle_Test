import { Component, OnInit } from '@angular/core';
import axios from 'axios';

import { Asset } from 'src/app/constant/asset.model';
import { PRIVATE_URI } from 'src/app/constant/static';
import { authorization } from 'src/app/utils/helper';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  tank_list: Array<Asset> = [];
  selected_index: number = -1;

  constructor() {
  }

  async ngOnInit() {
    const header = authorization();

    let res = await axios.get(`${PRIVATE_URI}Asset`, header);

    if(res.status === 200) {
      this.tank_list = res.data
      console.log(this.tank_list)
    }
  }

  selectedEventHandler(index: number) {
    this.selected_index = index;
  }
}
