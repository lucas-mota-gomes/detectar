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

  ngOnInit(): void {
    this.getRequests();
  }

  public getRequests() {
    this.loading.showLoading();
    this.requestService.getPaidRequests().then((response: any) => {
      this.loading.hideLoading();
      this.pedidos = response;
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
