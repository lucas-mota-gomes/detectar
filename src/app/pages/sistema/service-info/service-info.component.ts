import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RequestsService } from 'src/app/services/requests.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-service-info',
  templateUrl: './service-info.component.html',
  styleUrls: ['./service-info.component.scss']
})
export class ServiceInfoComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private readonly sessionService: SessionService,
    private readonly requestService: RequestsService
  ) { }

  ngOnInit(): void {
    this.getRequest();
  }

  public dados: any;
  public data: any;
  public step: number = 0;
  public items: any[] = [
    { label: 'Início', status: 1 },
    { label: 'Detetive Selecionado', status: 2 },
    { label: 'Investigando', status: 3 },
    { label: 'Retorno da solicitação', status: 4 },
    { label: 'Finalizado', status: 5 }
  ];

  public getRequest() {
    this.requestService.getRequest(this.route.snapshot.paramMap.get('id')).then((response: any) => {
      this.dados = response;
      this.dados.message = this.dados.status === 1 ? 'Seu processo ainda está no ínicio. Vamos direcionar um detetive para seu caso. Aguarde o contato do seu detetive.' : this.dados.status === 2 ? 'Detetive Selecionado' : this.dados.status === 3 ? 'Investigando' : this.dados.status === 4 ? 'Retorno da solicitação' : this.dados.status === 5 ? 'Finalizado' : '';
      this.data = new Date(this.dados.created).toLocaleDateString();
    }, (error: any) => {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar solicitação!' });
    });
  }

}
