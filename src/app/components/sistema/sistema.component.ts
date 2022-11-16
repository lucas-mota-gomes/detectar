import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-sistema',
  templateUrl: './sistema.component.html',
  styleUrls: ['./sistema.component.scss']
})
export class SistemaComponent implements OnInit {

  public display: boolean = false;
  public user: any = localStorage.getItem('pocketbase_auth') != null ? JSON.parse(localStorage.getItem('pocketbase_auth') as string).model.profile : undefined;

  constructor(private readonly session: SessionService) { }

  ngOnInit(): void {
  }

  logout(){
    this.session.logout();
  }
}
