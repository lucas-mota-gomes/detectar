import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RequestsService } from 'src/app/services/requests.service';
@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent implements OnInit {

  constructor(
    private readonly requestService: RequestsService,
    private messageService: MessageService,
    private router: Router
  ) { }

  public pedidos: any[] = [];

  ngOnInit(): void {
    this.getRequests();
  }

  public getRequests() {
    this.requestService.getPendingRequests().then((response: any) => {
      this.pedidos = response;
    }, (error: any) => {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar solicitações!' });
    });
  }

  getData(data: any) {
    return new Date(data).toLocaleDateString();
  }

}
