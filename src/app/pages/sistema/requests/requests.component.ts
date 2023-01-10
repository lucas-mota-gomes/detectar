import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

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
    this.requestService.getRequests().then((response: any) => {
      this.pedidos = response;
      console.log("🚀 ~ file: requests.component.ts:28 ~ RequestsComponent ~ this.requestService.getRequests ~ response", response)
    }, (error: any) => {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar solicitações!' });
    });
  }

  getData(data: any) {
    return new Date(data).toLocaleDateString();
  }


}
