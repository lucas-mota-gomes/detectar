import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/services/loading.service';
import { RequestsService } from 'src/app/services/requests.service';
import { SessionService } from 'src/app/services/session.service';
import { Clipboard } from '@capacitor/clipboard';

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
    private readonly requestService: RequestsService,
    private loading: LoadingService
  ) { }

  ngOnInit(): void {
    this.getRequest();
  }

  public dados: any;
  public data: any;
  public visible: boolean = false;
  public retornoDiag: boolean = false;
  public step: number = 0;
  public items: any[] = [
    { label: 'Início', status: 1 },
    { label: 'Detetive Selecionado', status: 2 },
    { label: 'Investigando', status: 3 },
    { label: 'Retorno da solicitação', status: 4 },
    { label: 'Finalizado', status: 5 }
  ];

  public getRequest() {
    this.loading.showLoading();
    this.requestService.getRequest(this.route.snapshot.paramMap.get('id')).then((response: any) => {
      this.loading.hideLoading();
      this.dados = response;
      this.dados.message = this.dados.status === 1 ? 'Seu processo ainda está no ínicio. Vamos direcionar um detetive para seu caso. Aguarde o contato do seu detetive.' : this.dados.status === 2 ? 'Detetive Selecionado' : this.dados.status === 3 ? 'Investigando' : this.dados.status === 4 ? 'Retorno da solicitação' : this.dados.status === 5 ? 'Finalizado' : '';
      this.data = new Date(this.dados.created).toLocaleDateString();
    }, (error: any) => {
      this.loading.hideLoading();
      console.log("🚀 ~ file: service-info.component.ts:45 ~ ServiceInfoComponent ~ this.requestService.getRequest ~ error", error)
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar solicitação!' });
    });
  }

  public aprovar() {
    this.loading.showLoading();
    this.requestService.updateRequest(this.dados.id, { status: 5 }).then((response: any) => {
      this.loading.hideLoading();
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Investigação aprovada!' });
      this.getRequest();
    }, (error: any) => {
      this.loading.hideLoading();
      console.log("🚀 ~ file: service-info.component.ts:45 ~ ServiceInfoComponent ~ this.requestService.getRequest ~ error", error)
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao aprovar investigação!' });
    });
  }

  public async copyToClipBoard() {
    try {
      await Clipboard.write({
        string: "31989796074"
      });
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Número copiado com sucesso para a área de transferência!' });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao copiar número!' });
    }

  }

  public openWhats() {
    window.open(`https://api.whatsapp.com/send/?phone=${'5531989796074'}`, "_blank")
  }

}
