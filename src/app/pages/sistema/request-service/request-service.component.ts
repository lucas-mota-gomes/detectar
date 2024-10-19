import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { RequestsService } from 'src/app/services/requests.service';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';
import { FileUpload } from 'primeng/fileupload';

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
    private loading: LoadingService,
    private cdr: ChangeDetectorRef
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

  public requestData: any = {};

  public edit = false;

  public requestId: any;

  public apiUrl = environment.pocketBaseUrl;

  public arquivos: any[] = [];

  @ViewChild('fileInput') fileInput: any;

  async ngOnInit(): Promise<void> {
    this.dadosService.valueChanges.subscribe((value: any) => {
      console.log("🚀 ~ file: request-service.component.ts:70 ~ RequestServiceComponent ~ this.dadosService.valueChanges.subscribe ~ value", this.fileInput);
    });
    this.id = this.route.snapshot.paramMap.get('id') as string;
    if (this.route.snapshot.paramMap.get('requestId')) {
      this.loading.showLoading();
      this.requestId = this.route.snapshot.paramMap.get('requestId') as string;
      this.edit = true;
      this.requestData = await this.requestService.getRequest(this.requestId);
      this.fileInput?.clear();

      // Patch nos valores do formulário
      this.dadosService.patchValue({
        nome: this.requestData.nome,
        cidade: this.requestData.cidade,
        estado: this.requestData.estado,
        relato: this.requestData.relato,
        anexos: this.requestData.anexos.map((item: any) => {
          return this.apiUrl + '/api/files/requests/' + this.requestId + '/' + item;
        })
      });

      // Para baixar os anexos e adicionar ao formData
      for (const [index,item] of this.requestData.anexos.entries()) {
        console.log("🚀 ~ RequestServiceComponent ~ ngOnInit ~ index:", index)
        const fileUrl = this.apiUrl + '/api/files/requests/' + this.requestId + '/' + item;
      
        // Fazendo o download do arquivo
        const response = await fetch(fileUrl);
        const blob = await response.blob();
      
        // Criando o arquivo para ser enviado no formData
        const file = new File([blob], item, { type: blob.type }) as any;
        
        // Criando a propriedade objectURL
        file.objectURL = URL.createObjectURL(blob);
        this.formData.append('anexos', file);
        this.arquivos.push(file);
        if(index == this.requestData.anexos.length - 1){
          this.fileInput.clear();
          this.fileInput.files = this.arquivos;
        }
      }
      
      this.cdr.detectChanges(); 
      this.loading.hideLoading();
    }

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
    console.log("🚀 ~ RequestServiceComponent ~ anexar ~ event:", event)
    const files = event.currentFiles;
    this.formData.delete('anexos');
    for (const iterator of files) {
      this.formData.append('anexos', iterator);
    }
  }

  removerAnexo(event: any) {
    const index = this.arquivos.findIndex((item: any) => {
      return item.objectURL.changingThisBreaksApplicationSecurity === event.file.objectURL.changingThisBreaksApplicationSecurity;
    });
    this.arquivos.splice(index, 1);
    this.formData.delete('anexos');
    for (const iterator of this.arquivos) {
      this.formData.append('anexos', iterator);
    }
    console.log("🚀 ~ RequestServiceComponent ~ removerAnexo ~ this.formData:", this.formData.getAll('anexos'))
  }

  getFile(file: any): any{
    // console.log("🚀 ~ RequestServiceComponent ~ getFile ~ file:", file)
    return file;
  }

  editRequest() {
    this.loading.showLoading();
    const dados = this.dadosService.value;
    this.formData.append('nome', dados.nome);
    this.formData.append('cidade', dados.cidade);
    this.formData.append('estado', dados.estado);
    this.formData.append('relato', dados.relato);
    this.formData.append('user', this.sessionService.getUser().id);
    this.formData.append('speciality', this.id);
    console.log("🚀 ~ RequestServiceComponent ~ editRequest ~ this.formData.getAll('anexos'):", this.formData.getAll('anexos'))

    this.requestService.editRequest(this.formData, this.requestId).then((response: any) => {
      this.loading.hideLoading();
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Solicitação realizada com sucesso!' });
      this.router.navigate(['/sistema/pagamento/' + response.id]);
    }, (error: any) => {
      console.log("🚀 ~ file: request-service.component.ts:64 ~ RequestServiceComponent ~ this.requestService.newRequest ~ error", error)
      this.loading.hideLoading();
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao realizar solicitação!' });
    });
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
