import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { removeItem } from 'src/app/utils/helper';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSignOut(): void {
    removeItem('access_token');
    this.router.navigate(['/auth/signin']);
  }

}
