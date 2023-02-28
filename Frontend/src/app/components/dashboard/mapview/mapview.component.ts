import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';


import { getName, getCode } from 'country-list';
import { MapTypeStyle } from '@agm/core';
import axios from 'axios';
import { PRIVATE_URI } from 'src/app/constant/static';
import { authorization } from 'src/app/utils/helper';

@Component({
  selector: 'app-mapview',
  templateUrl: './mapview.component.html',
  styleUrls: ['./mapview.component.scss']
})

export class MapviewComponent implements OnInit, OnChanges {
  @Input() listData: Array<any> = [];
  @Input() centerIndex: number = 0;

  points : Array<any> = [] ;
  commandList: Array<any> = [];

  select_fill_oil_cmd : boolean = false;
  select_repair_tank_cmd : boolean = false;
  index: number = 0;

  isShowDataInfo :boolean = false ;
  zoom: number = 1;
  current_opened_index : number = -1 ;

  // isShowDataInfo : boolean = false ;
  current_info : any ;

  // initial center position for the map
  ct_lat: number = 0;
  ct_lng: number = 0;

  labelOptions = [{
      color: 'white',
      fontFamily: 'bold',
      fontSize: '18px',
      fontWeight: 'bold',
      text: "87"
  },{
    color: 'white',
    fontFamily: 'bold',
    fontSize: '18px',
    fontWeight: 'bold',
    text: "87"
},{
  color: 'white',
  fontFamily: 'bold',
  fontSize: '18px',
  fontWeight: 'bold',
  text: "87"
},{
  color: 'white',
  fontFamily: 'bold',
  fontSize: '18px',
  fontWeight: 'bold',
  text: "87"
},{
  color: 'white',
  fontFamily: 'bold',
  fontSize: '18px',
  fontWeight: 'bold',
  text: "87"
}]

  endpoints_arr : Array<any> = [];

  Styles : MapTypeStyle[] = [] ;

  JSON_MAP_STYLES = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ]

  async ngOnInit() {
    const header = authorization();

    const res =  await axios.get(`${PRIVATE_URI}Command`, header);

    if(res.status === 200) {
      for(let i = 0 ; i < this.listData.length ; i++) {
        for (let j = 0 ; j < res.data.length ; j++) {
          if(res.data[j].tankName === this.listData[i].tankName && res.data[j].command === 'Repair')
            this.commandList[i] = res.data[j];
            console.log(this.commandList);
        }
      }
    }
  }

  ngOnChanges(changes:SimpleChanges) {
    let options = [];
    for(let i = 0 ; i < this.listData.length ; i++) {
      options.push({
        color: 'white',
        fontFamily: 'bold',
        fontSize: '18px',
        fontWeight: 'bold',
        text: String(this.listData[i].amount)
      })
    }

    let tank_data = [];
    for (let i = 0 ; i < this.listData.length ; i++) {
      console.log(this.commandList[i])
      tank_data.push({
          "endpoint": "185.155.103.59",
          "country_code": "DE",
          "is_block": 1,
          "latitude": this.listData[i].latitude,
          "longitude": this.listData[i].longitude,
          "minAmount": this.listData[i].minAmount,
          "repair": this.commandList[i]?.command
      })
    }
    this.labelOptions = options;
    this.points = tank_data;
  }

  isOpened(index : number) {
    if(index === this.current_opened_index) return true;
    return false;
  }

  showEndpointInfo(data: any) {
    this.current_info = data;
    // this.isShowDataInfo = true ;

    return ;
  }

  clickedMarker(label: string, index: number) {
    this.current_opened_index = index;
  }

  handleOpenModal(i: number) {
    this.index = i;
    (<any>$("#tankSituation")).modal('show')
  }

  getCountryName(code : string) {
    return getName(code) ;
  }

  stringToNumber(value: string) {
    return Number(value)
  }

  constructor() {
    this.JSON_MAP_STYLES.forEach((style:any) => {
      this.Styles.push(style);
    })
  }

  async submitCommand() {

    const header = authorization();
    if(this.select_fill_oil_cmd ) {
      try {

        const res =  await axios.post(`${PRIVATE_URI}Command`, {
          tankName: this.listData[this.index].tankName,
          command: 'Fill'
        }, header)

        if(res.status === 200) {
          this.select_fill_oil_cmd = false;
          alert("Successfully notified Fill")
        }
      } catch(error){
        this.select_fill_oil_cmd = false;
        alert("You already notified Fill")
      }
    }

    if(this.select_repair_tank_cmd ) {
      try{
        const res =  await axios.post(`${PRIVATE_URI}Command`, {
          tankName: this.listData[this.index].tankName,
          command: 'Repair'
        }, header)

        if(res.status === 200) {
          this.select_repair_tank_cmd = false;
          alert("Successfully notified Repair")
        }
      } catch(error){
        this.select_repair_tank_cmd = false;
        alert("You already notified Repair")
      }
    }

  }

}
