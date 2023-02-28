import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { PRIVATE_URI } from 'src/app/constant/static';
import { authorization, formatDBDate, getItem } from 'src/app/utils/helper';

@Component({
  selector: 'app-logs-list',
  templateUrl: './logs-list.component.html',
  styleUrls: ['./logs-list.component.scss']
})

export class LogsListComponent implements OnInit {

  log_list: Array<any> = [];

  constructor() { }

  async ngOnInit() {
    const header = authorization();

    let res = await axios.get(`${PRIVATE_URI}Log`, header);

    if(res.status === 200) {
      console.log(res.data)
      for( let i = res.data.length-1 ; i >= 0 ; i--) {
        if(res.data[i].userEmail === getItem('user_email'))
          this.log_list.push(res.data[i])
      }
    }
  }

  changeDateType(db_date: any) {
    return formatDBDate(db_date)
  }

}
