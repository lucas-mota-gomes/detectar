import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RequestsService } from 'src/app/services/requests.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private readonly sessionService: SessionService,
    private readonly requestService: RequestsService
  ) { }

  public paymentForm: FormGroup = this._fb.group({
    cardNumber: [null, [Validators.required]],
    name: [null, [Validators.required]],
    cvv: [null, [Validators.required]],
    cpf: [null, [Validators.required]],
  });

  public confirmModal: boolean = false;

  public id: any;

  public request: any;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getRequest();
  }

  confirmPayment() {
    this.confirmModal = true;
  }

  getRequest(){
    this.requestService.getRequest(this.id).then((response: any) => {
      this.request = response;
    }, (error: any) => {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao realizar solicitação!' });
    });
  }

}
