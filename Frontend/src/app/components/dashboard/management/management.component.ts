import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import axios from 'axios';
import { PRIVATE_URI } from 'src/app/constant/static';
import { authorization, getItem } from 'src/app/utils/helper';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit, OnChanges {

  @Input() command_list: Array<any> = [];
  @Output() newBuyEvent: EventEmitter<any> = new EventEmitter();
  @Output() newSellEvent: EventEmitter<any> = new EventEmitter();

  userEmail: string = String(getItem('user_email'));
  own_command: Array<any> = [];

  buyAmount: string = '';
  sellAmount: string = '';
  buyer: string = '';
  seller: string = '';
  isRepair: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.command_list.length !== 0) {
      for(let i = 0 ; i < this.command_list.length ; i++) {
        if(this.command_list[i].userEmail === this.userEmail && this.command_list[i].flag === false) {
          this.own_command.push(this.command_list[i])
        }
      }
    }
  }

  onBuyAmount(event: Event) {
    this.buyAmount = (event.target as HTMLInputElement).value && (event.target as HTMLInputElement).value;
    this.newBuyEvent.emit(this.buyAmount);
  }

  onChangeBuyer(event: Event) {
    this.buyer = (event.target as HTMLInputElement).value && (event.target as HTMLInputElement).value;
  }

  onSellAmount(event: Event) {
    this.sellAmount = (event.target as HTMLInputElement).value && (event.target as HTMLInputElement).value;
    this.newSellEvent.emit(this.sellAmount);
  }

  onChangeSeller(event: Event) {
    this.seller = (event.target as HTMLInputElement).value && (event.target as HTMLInputElement).value;
  }

  async onBuyOil() {
    let fillCount = 0;
    const header = authorization();
    for(let i = 0 ; i < this.own_command.length ; i++) {
      if(this.own_command[i].command === 'Fill') {
        let command = this.own_command[i];
        if(fillCount === 0)
            axios.post(`${PRIVATE_URI}BuyAsset`, {
              userEmail: this.userEmail,
              amount: Number(this.buyAmount)
            }, header) .then(async function (response) {
              alert("Successfully purchased")

            }) .catch(function (error) {
              alert(error.response.data)
            })

        if(fillCount !== 0)
            await axios.get(`${PRIVATE_URI}Command/${command.id}`, header)
              .then(function(res) {
                axios.post(`${PRIVATE_URI}TotalAsset/${command.userEmail}`, {}, header)
              })

        fillCount++;
      }
    }
    if(fillCount === 0) {
      const user_email = this.userEmail;
      axios.post(`${PRIVATE_URI}BuyAsset`, {
        userEmail: this.userEmail,
        amount: Number(this.buyAmount),
        from: this.buyer
      }, header) .then(function (response) {
        alert("Successfully purchased")
        axios.post(`${PRIVATE_URI}TotalAsset/${user_email}`, {}, header)
      }) .catch(function(error) {
        console.log(error);
      })
    }
  }

  async onSellOil() {
    const user_email = this.userEmail;
    const header = authorization();

    await axios.post(`${PRIVATE_URI}SellAsset`, {
      userEmail: this.userEmail,
      amount: Number(this.sellAmount),
      from: this.seller
    }, header) .then(function(res) {
      alert('Successfully sold')
      axios.post(`${PRIVATE_URI}TotalAsset/${user_email}`, {}, header)
    }) .catch(function(error) {
      alert("Rest amount is below the min amount")
    })

  }

  async onRepair() {
    const header = authorization();

    for(let i = 0 ; i < this.own_command.length ; i++) {
      if(this.own_command[i].command === 'Repair') {
        await axios.get(`${PRIVATE_URI}Command/${this.own_command[i].id}`, header);

      }
    }
  }
}
