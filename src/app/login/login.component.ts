import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('EnterLeaveLeft', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s 2s ease-out')
      ]),
      transition(':leave', [
        animate('0.3s 2000ms ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ]),

    trigger('EnterLeaveRight', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(200%)' }),
        animate('0.5s 2s ease-out')
      ]),
      transition(':leave', [
        animate('0.3s 2s ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})

export class LoginComponent implements OnInit {
  email: string = "";
  password: string = "";
  username: string = "";

  constructor(private loginSvc: LoginService) {

  }

  ngOnInit(): void {
    
  }

  public toggleForm() {
    const container = document.querySelector('.container');
    container?.classList.toggle('active');
  }

  public login() {
    console.log(this.email, this.password);
    this.loginSvc.login(this.email, this.password).subscribe(res => {
      console.log(res);
    }, (err) => {
      console.log(err);
    })
  }

}
