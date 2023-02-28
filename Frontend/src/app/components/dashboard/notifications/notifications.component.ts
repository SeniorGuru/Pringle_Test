import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  private hubConnectionBuilder!: HubConnection;
  notify_list: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.initWebSocket();
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

    this.hubConnectionBuilder.on('SendCommands', (data: any) => {
      console.log(data)
      this.notify_list = data;
    });

  }
}
