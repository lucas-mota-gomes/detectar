import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RequestsService } from 'src/app/services/requests.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-detective.request-detail',
  templateUrl: './detective.request-detail.component.html',
  styleUrls: ['./detective.request-detail.component.scss']
})
export class DetectiveRequestDetailComponent implements OnInit {

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
  public visible: boolean = false;
  public data: any;
  public step: number = 0;
  public formData = new FormData();
  public retornoDiag: boolean = false;
  public relato: any;
  public items: any[] = [
    { label: 'Início', status: 1 },
    { label: 'Detetive Selecionado', status: 2 },
    { label: 'Investigando', status: 3 },
    { label: 'Retorno da solicitação', status: 4 },
    { label: 'Finalizado', status: 5 }
  ];

  public getRequest() {
    this.requestService.getRequest(this.route.snapshot.paramMap.get('id')).then(async (response: any) => {
      this.dados = response;
      this.dados.message = this.dados.status === 1 ? 'Seu processo ainda está no ínicio. Vamos direcionar um detetive para seu caso. Aguarde o contato do seu detetive.' : this.dados.status === 2 ? 'Detetive Selecionado' : this.dados.status === 3 ? 'Investigando' : this.dados.status === 4 ? 'Retorno da solicitação' : this.dados.status === 5 ? 'Finalizado' : '';
      this.data = new Date(this.dados.created).toLocaleDateString();
      // for (let iterator of this.dados.anexos) {
      //   const url = await this.requestService.getFileUrl(this.dados.id, iterator) as any;
      //   iterator = url;
      // }
    }, (error: any) => {
      console.log("🚀 ~ file: service-info.component.ts:45 ~ ServiceInfoComponent ~ this.requestService.getRequest ~ error", error)
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar solicitação!' });
    });
  }

  public iniciarInvestigacao(){
    this.requestService.updateRequest(this.dados.id, {status: 3}).then((response: any) => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Investigação iniciada!' });
      this.getRequest();
    }, (error: any) => {
      console.log("🚀 ~ file: service-info.component.ts:45 ~ ServiceInfoComponent ~ this.requestService.getRequest ~ error", error)
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao iniciar investigação!' });
    })
  }

  anexar(event: any) {
    const files = event.target.files;
    for (const iterator of files) {
      this.formData.append('retorno', iterator);
    }
  }

  public iniciarRetorno(){
    this.formData.append('relatoDetetive', this.relato);
    this.formData.append('status', '4');
    this.requestService.updateRequest(this.dados.id, this.formData).then((response: any) => {
      this.retornoDiag = false;
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Retorno iniciado!' });
      this.getRequest();
    }, (error: any) => {
      console.log("🚀 ~ file: service-info.component.ts:45 ~ ServiceInfoComponent ~ this.requestService.getRequest ~ error", error)
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao iniciar retorno!' });
    })
  }

}
