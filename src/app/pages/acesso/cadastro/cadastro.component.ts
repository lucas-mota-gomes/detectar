import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
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

  public visible = false;
  public cep = '';
  public number = '';
  public viaCep: any;

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
    email: [null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
    password: [null, [Validators.required, Validators.minLength(8)]],
  });

  public registerFormDetetive: FormGroup = this._fb.group({
    name: [null, [Validators.required]],
    cpf: [null, [Validators.required]],
    RG: [null, [Validators.required]],
    address: [null, [Validators.required]],
    celular: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
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
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar especialidades!' });
    });
  }

  public getCep() {
    if (this.cep.length == 8 && !Number.isNaN(Number(this.cep))) {
      this.sessionService.getCep(this.cep).then((res: any) => {
        this.viaCep = res;
      }
      ).catch((err: any) => {
        console.log(err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar endereço!' });
      }
      );
    }
  }

  public getNumber() {
    this.registerFormCliente.controls['address'].setValue(this.viaCep.logradouro + ', ' + this.viaCep.bairro + ', ' + this.viaCep.localidade + ', ' + this.viaCep.uf + ', ' + this.number);
    this.registerFormDetetive.controls['address'].setValue(this.viaCep.logradouro + ', ' + this.viaCep.bairro + ', ' + this.viaCep.localidade + ', ' + this.viaCep.uf + ', ' + this.number);
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
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro realizado com sucesso!' });
        this.router.navigate(['/sistema/home']);
      }).catch((err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao realizar cadastro!' });
      });
    }
    else {
      data.type = 'detetive';
      this.sessionService.register(data).then((res: any) => {
        this.loading.hideLoading();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro realizado com sucesso!' });
        this.router.navigate(['/sistema/detetive/requests']);
      }).catch((err: any) => {
        this.loading.hideLoading();
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao realizar cadastro!' });
      });
    }
  }

  public maskCpfCnpj(form: AbstractControl | null) {
    if(form === null) return;
    let value = form.value;
    if(value.length > 18) {
      form.setValue(value.substring(0, 18));
      return;
    }
    if (value.length <= 14) {
      form.setValue(value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2'));
      if(value.length === 14 && !this.isValidCPF(value)) {
        form.setErrors({invalid: true});
      }
    } else {
      form.setValue(value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})/, '$1-$2'));
      if(value.length === 18 && !this.isValidCNPJ(value)) {
        form.setErrors({invalid: true});
      }
    }
  }

  public isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.charAt(9))) {
      return false;
    }
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    return remainder === parseInt(cpf.charAt(10));
  }

  public isValidCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
      return false;
    }

    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    let digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) {
      return false;
    }

    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result === parseInt(digits.charAt(1));
  }


}
