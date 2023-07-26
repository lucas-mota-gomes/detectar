import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/services/loading.service';
import { PagseguroService } from 'src/app/services/pagseguro.service';
import { RequestsService } from 'src/app/services/requests.service';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private readonly sessionService: SessionService,
    private readonly requestService: RequestsService,
    private readonly pagseguroService: PagseguroService,
    private loading: LoadingService
  ) { }

  public paymentForm: FormGroup = this._fb.group({
    cardNumber: [null, [Validators.required]],
    name: [null, [Validators.required]],
    cvv: [null, [Validators.required]],
    cpf: [null, [Validators.required]],
    expiration: [null, [Validators.required]],
    publicKey: [environment.pagSeguroPublicKey, [Validators.required]]
  });

  public confirmModal: boolean = false;

  public id: any;

  public request: any;

  public window: any = window;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getRequest();
    this.setCardTest();
    this.pagseguroService.getPublicId().then((response: any) => {
      this.paymentForm.get('publicKey')?.setValue(response.public_key);
    });
  }

  setCardTest() {
    this.paymentForm.patchValue({
      cardNumber: '4111111111111111',
      name: 'Teste Detectar',
      cvv: '123',
      cpf: '13625086670',
      expiration: '12/2030'
    });
  }

  confirmPayment() {
    // this.confirmModal = true;
    this.loading.showLoading();
    const user = this.sessionService.getUser();
    const card = {
      holder: this.paymentForm.get('name')?.value,
      number: this.paymentForm.get('cardNumber')?.value,
      securityCode: this.paymentForm.get('cvv')?.value,
      expMonth: this.paymentForm.get('expiration')?.value.split('/')[0],
      expYear: this.paymentForm.get('expiration')?.value.split('/')[1]
    }

    this.pagseguroService.pay(card, user, this.request).then((response: any) => {
        this.loading.hideLoading();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pagamento realizado com sucesso!' });
        this.requestService.updateRequest(this.id, { status: 1 }).then((response: any) => { });
        this.window.cart = this.window.cart - 1;
        this.confirmModal = true;
    }).catch((error: any) => {
      this.loading.hideLoading();
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao realizar solicitação!' });
    });
  }

  getRequest() {
    this.loading.showLoading();
    this.requestService.getRequest(this.id).then((response: any) => {
      this.loading.hideLoading();
      this.request = response;
    }, (error: any) => {
      console.log("🚀 ~ file: pagamento.component.ts:101 ~ PagamentoComponent ~ this.requestService.getRequest ~ error", error)
      this.loading.hideLoading();
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao realizar solicitação!' });
    });
  }

}
