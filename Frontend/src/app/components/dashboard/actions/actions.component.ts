import { Component, OnInit } from '@angular/core';
import axios from 'axios';

import { PRIVATE_URI } from 'src/app/constant/static';
import { authorization } from 'src/app/utils/helper';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  name: String = 'john_doe';
  email: String = '';
  latitude: String = '';
  longitude: String = '';
  password: String = '';
  amount: String = '';

  limitAmount: string = '';
  periodDay: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  onNameChange(event: Event): void {
    this.name = (event.target as HTMLInputElement).value && (event.target as HTMLInputElement).value;
  }

  onEmailChange(event: Event): void {
    this.email = (event.target as HTMLInputElement).value && (event.target as HTMLInputElement).value;
  }

  onLatitudeChange(event: Event): void {
    this.latitude = (event.target as HTMLInputElement).value && (event.target as HTMLInputElement).value;
  }

  onLongitudeChange(event: Event): void {
    this.longitude = (event.target as HTMLInputElement).value && (event.target as HTMLInputElement).value;
  }

  onPasswordChange(event: Event): void {
    this.password = (event.target as HTMLInputElement).value && (event.target as HTMLInputElement).value;
  }

  onAmountChange(event: Event): void {
    this.amount = (event.target as HTMLInputElement).value && (event.target as HTMLInputElement).value;
  }

  onRegister(): void {

    const tankName = this.name;
    const header = authorization();

    axios.post(`${PRIVATE_URI}Asset`, {
      tankName: this.name,
      userEmail: this.email,
      password: this.password,
      latitude: Number(this.latitude),
      longitude: Number(this.longitude),
      maxAmount: Number(this.amount),
    }, header)
      .then(async function (response) {
          alert("Successfully registered")

      }) .catch(function (error) {
        console.log('This manager already exist')
      })
  }

  async onSendAlert() {
    const header = authorization();
    console.log(this.limitAmount, this.periodDay)
    let res = await axios.post(`${PRIVATE_URI}SetLimitAmount`, {
      minAmount: this.limitAmount,
      period: this.periodDay
    }, header)
    if(res.status === 200) {
      alert('Success')
    }
  }

  onSetLimitAmount(event: Event): void {
    this.limitAmount = (event.target as HTMLInputElement).value && (event.target as HTMLInputElement).value;
    console.log(this.limitAmount)
  }
  onSetPeriodDay(event: Event): void {
    this.periodDay = (event.target as HTMLInputElement).value && (event.target as HTMLInputElement).value;
  }
}
