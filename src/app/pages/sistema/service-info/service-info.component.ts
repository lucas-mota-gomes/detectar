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
    { label: 'Início', active: true },
    { label: 'Detetive Selecionado', active: false },
    { label: 'Investigando', active: false },
    { label: 'Retorno da solicitação', active: false },
    { label: 'Finalizado', active: false }
  ];

  public getRequest() {
    this.requestService.getRequest(this.route.snapshot.paramMap.get('id')).then((response: any) => {
      this.dados = response;
      this.data = new Date(this.dados.created).toLocaleDateString();
    }, (error: any) => {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar solicitação!' });
    });
  }

}
