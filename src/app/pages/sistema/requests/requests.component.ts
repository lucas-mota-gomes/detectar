import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/services/loading.service';
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
    private router: Router,
    private loading: LoadingService
  ) { }

  public pedidos: any[] = [];
  public today = new Date();
  public sevenDaysAgo: string = new Date(this.today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(); // Data de 7 dias atrás

  ngOnInit(): void {
    this.getRequests();
  }

  public getRequests() {
    this.loading.showLoading();
    this.requestService.getPaidRequests('updated > '+`'${this.sevenDaysAgo}'`).then((response: any) => {
      this.loading.hideLoading();
      this.pedidos = response;
      for (let item of this.pedidos) {
        const targetDate = new Date(item.updated);
        item.remainingDays = 7 - Math.floor((Date.now() - targetDate.getTime()) / (24 * 60 * 60 * 1000)) // Dias até completar 7 dias
      }
      console.log("🚀 ~ file: requests.component.ts:42 ~ RequestsComponent ~ this.pedidos.map ~  this.pedidos",  this.pedidos)
    }, (error: any) => {
      this.loading.hideLoading();
      console.log("🚀 ~ file: requests.component.ts:29 ~ RequestsComponent ~ this.requestService.getPaidRequests ~ error", error)
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar solicitações!' });
    });
  }

  getData(data: any) {
    return new Date(data).toLocaleDateString();
  }


}
