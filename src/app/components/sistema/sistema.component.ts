import { Component, OnInit } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-sistema',
  templateUrl: './sistema.component.html',
  styleUrls: ['./sistema.component.scss']
})
export class SistemaComponent implements OnInit {

  public display: boolean = false;
  public user: any = localStorage.getItem('pocketbase_auth') != null ? JSON.parse(localStorage.getItem('pocketbase_auth') as string).model.profile : undefined;
  public pedidos: any;
  window: any = window;

  constructor(private readonly session: SessionService, private readonly requestService: RequestsService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.requestService.getPendingRequests().then((response: any) => {
        this.pedidos = response.length > 0 ? response.length.toString() : undefined;
        this.window.cart = this.pedidos;
      });
    }, 1000);

  }

  logout(){
    this.session.logout();
  }
}
