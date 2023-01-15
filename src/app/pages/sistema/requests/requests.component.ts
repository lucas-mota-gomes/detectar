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
    this.requestService.getPaidRequests().then((response: any) => {
      this.pedidos = response;
    }, (error: any) => {
      console.log("🚀 ~ file: requests.component.ts:29 ~ RequestsComponent ~ this.requestService.getPaidRequests ~ error", error)
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar solicitações!' });
    });
  }

  getData(data: any) {
    return new Date(data).toLocaleDateString();
  }


}
