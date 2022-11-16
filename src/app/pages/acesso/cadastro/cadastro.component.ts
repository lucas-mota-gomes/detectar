import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { MessageService } from 'primeng/api';
import { SessionService } from 'src/app/services/session.service';

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
     private readonly sessionService: SessionService) { }

  public registerFormCliente: FormGroup = this._fb.group({
    name: [null, [Validators.required]],
    cpf: [null, [Validators.required]],
    RG: [null, [Validators.required]],
    address: [null, [Validators.required]],
    celular: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]],
  });

  public registerFormDetetive: FormGroup = this._fb.group({
    name: [null, [Validators.required]],
    cpf: [null, [Validators.required]],
    RG: [null, [Validators.required]],
    address: [null, [Validators.required]],
    celular: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]],
    speciality: [null, [Validators.required]],
    description: [null, [Validators.required]]
  });

  public userType: string = 'cliente';

  public specialities: any[] = [
    {label: 'Varredura Telefônica', value: 0},
    {label: 'Teste de Fidelidade', value: 1},
    {label: 'Localização de Veículos', value: 2},
    {label: 'Localização de Pessoas', value: 3},
    {label: 'Investigação Empresarial', value: 4},
    {label: 'Investigação de Paternidade', value: 5},
    {label: 'Investigação de Conjugal', value: 6},
    {label: 'Inteligência e conta-inteligência', value: 7},
    {label: 'Cumprimento de mandado', value: 8},
    {label: 'Investigação Criminal', value: 9},
    {label: 'Crimes Cibernéticos', value: 10},
    {label: 'Outros', value: 11},
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.userType = params.get('userType');
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
    const data = this.userType === 'cliente' ? this.registerFormCliente.value : this.registerFormDetetive.value;
    if (this.userType === 'cliente') {
      data.type = 'cliente';
      this.sessionService.register(data).then((res: any) => {
        this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Cadastro realizado com sucesso!'});
        this.router.navigate(['/sistema/home']);
      }).catch((err: any) => {
        this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao realizar cadastro!'});
      });
    }
    else {
      data.type = 'detetive';
      this.sessionService.register(data).then((res: any) => {
        this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Cadastro realizado com sucesso!'});
        this.router.navigate(['/sistema/home']);

      }).catch((err: any) => {
        this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao realizar cadastro!'});
      });
    }
  }


}
