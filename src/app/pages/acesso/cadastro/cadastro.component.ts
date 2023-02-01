import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/services/loading.service';
import { SessionService } from 'src/app/services/session.service';
import { SpecialitiesService } from 'src/app/services/specialities.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
     private router: Router,
     private route: ActivatedRoute,
     private messageService: MessageService,
     private specialityService: SpecialitiesService,
     private loading: LoadingService,
     private readonly sessionService: SessionService) { }

  public registerFormCliente: FormGroup = this._fb.group({
    name: [null, [Validators.required]],
    cpf: [null, [Validators.required]],
    RG: [null, [Validators.required]],
    address: [null, [Validators.required]],
    celular: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(8)]],
  });

  public registerFormDetetive: FormGroup = this._fb.group({
    name: [null, [Validators.required]],
    cpf: [null, [Validators.required]],
    RG: [null, [Validators.required]],
    address: [null, [Validators.required]],
    celular: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(8)]],
    speciality: [null, [Validators.required]],
    description: [null, [Validators.required]]
  });

  public userType: string = 'cliente';

  public specialities: any[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.userType = params.get('userType');
    });

    this.specialityService.getSpecialities().then((res: any) => {
      this.specialities = res;
    }).catch((err: any) => {
      console.log(err);
      this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao buscar especialidades!'});
    });
  }

  public validateForm(): boolean {
    if (this.userType === 'cliente') {
      return this.registerFormCliente.valid;
    } else {
      return this.registerFormDetetive.valid;
    }
  }

  public register(): void {
    this.loading.showLoading();
    const data = this.userType === 'cliente' ? this.registerFormCliente.value : this.registerFormDetetive.value;
    if (this.userType === 'cliente') {
      data.type = 'cliente';
      this.sessionService.register(data).then((res: any) => {
        this.loading.hideLoading();
        this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Cadastro realizado com sucesso!'});
        this.router.navigate(['/sistema/home']);
      }).catch((err: any) => {
        this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao realizar cadastro!'});
      });
    }
    else {
      data.type = 'detetive';
      this.sessionService.register(data).then((res: any) => {
        this.loading.hideLoading();
        this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Cadastro realizado com sucesso!'});
        this.router.navigate(['/sistema/detetive/requests']);
      }).catch((err: any) => {
        this.loading.hideLoading();
        this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao realizar cadastro!'});
      });
    }
  }


}
