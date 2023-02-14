import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/services/loading.service';
import { RequestsService } from 'src/app/services/requests.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-request-service',
  templateUrl: './request-service.component.html',
  styleUrls: ['./request-service.component.scss']
})
export class RequestServiceComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private readonly sessionService: SessionService,
    private readonly requestService: RequestsService,
    private loading: LoadingService
  ) { }

  public dadosService: FormGroup = this._fb.group({
    nome: [null, [Validators.required]],
    cidade: [null, [Validators.required]],
    estado: [null, [Validators.required]],
    relato: [null, [Validators.required]],
    anexos: [null]
  });

  public id: any;

  public formData = new FormData();

  public request: any = {};

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.loading.showLoading();
    this.requestService.getSpecialty(this.id).then((response: any) => {
      this.loading.hideLoading();
      this.request = response;
    }).catch((error: any) => {
      this.loading.hideLoading();
      console.log("🚀 ~ file: request-service.component.ts:48 ~ RequestServiceComponent ~ this.requestService.getRequest ~ error", error)
    });
  }

  anexar(event: any) {
    const files = event.target.files;
    for (const iterator of files) {
      this.formData.append('anexos', iterator);
    }
  }

  newRequest() {
    this.loading.showLoading();
    const dados = this.dadosService.value;
    this.formData.append('nome', dados.nome);
    this.formData.append('cidade', dados.cidade);
    this.formData.append('estado', dados.estado);
    this.formData.append('relato', dados.relato);
    this.formData.append('user', this.sessionService.getUser().id);
    this.formData.append('speciality', this.id);

    this.requestService.newRequest(this.formData).then((response: any) => {
      this.loading.hideLoading();
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Solicitação realizada com sucesso!' });
      this.router.navigate(['/sistema/pagamento/' + response.id]);
    }, (error: any) => {
      console.log("🚀 ~ file: request-service.component.ts:64 ~ RequestServiceComponent ~ this.requestService.newRequest ~ error", error)
      this.loading.hideLoading();
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao realizar solicitação!' });
    });
  }

}
