import { Injectable } from '@angular/core';
// angular http client
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// environment
import { environment } from '../../environments/environment';
import { MessageService } from 'primeng/api';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class PagseguroService {

  window = window as any;


  constructor(private http: HttpClient, private message: MessageService, private sessionService: SessionService) {
  }

  // get the pagseguro session id
  getSessionId() {
    console.log("🚀 ~ file: pagseguro.service.ts:21 ~ PagseguroService ~ this.http.get ~ environment.pagSeguroApi", environment.pagSeguroApi);
    const headers = {
      'Content-Type': 'application/xml',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Credentials': 'true'
    };
    this.http.post(`${environment.pagSeguroApi}?email=${environment.pagSeguroEmail}&token=${environment.pagSeguroToken}`, {}, { headers: headers, responseType: 'text' }).pipe().subscribe((res: any) => {
      //get <id> between <id> and </id>
      res = res.match(/<id>(.*?)<\/id>/)[1];
      console.log("🚀 ~ file: pagseguro.service.ts:30 ~ PagseguroService ~ this.http.post ~ res", res)
      this.window.PagSeguroDirectPayment.setSessionId(res);
      this.getPaymentMethods();
      this.getSenderHash();
    });
  }

  getPaymentMethods() {
    this.window.PagSeguroDirectPayment.getPaymentMethods({
      amount: 500.00,
      success: function (response: any) {
        // Retorna os meios de pagamento disponíveis.
        console.log("🚀 ~ file: pagseguro.service.ts:44 ~ PagseguroService ~ this.http.post ~ response", response);
      },
      error: function (response: any) {
        console.log("🚀 ~ file: pagseguro.service.ts:45 ~ PagseguroService ~ this.http.post ~ response", response)
        // Callback para chamadas que falharam.
      },
      complete: function (response: any) {
        // Callback para todas chamadas.
      }
    });
  }

  getSenderHash() {
    this.window.PagSeguroDirectPayment.onSenderHashReady((response: any) => {
      if (response.status == 'error') {
        console.log(response.message);
        return false;
      }
      var hash = response.senderHash; //Hash estará disponível nesta variável.
      this.window.senderHash = hash;
      return hash
    });
  }

  createCardToken(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.window.PagSeguroDirectPayment.createCardToken({
        cardNumber: data.cardNumber, // Número do cartão de crédito
        brand: data.brand, // Bandeira do cartão
        cvv: data.cvv, // CVV do cartão
        expirationMonth: data.expirationMonth, // Mês da expiração do cartão
        expirationYear: data.expirationYear, // Ano da expiração do cartão, é necessário os 4 dígitos.
        success: (response: any) => {
          // Retorna o cartão tokenizado.
          (window as any).cardToken = response.card['token'];
          resolve(response.card['token']);
        },
        error: (response: any) => {
          // Callback para chamadas que falharam.
          reject (new Error("Erro ao gerar token do cartão"));
        }
      });
    }
    );


  }

  // send the payment data to the server
  sendPaymentData(data: any) {
    const user = this.sessionService.getUser();
    console.log("🚀 ~ file: pagseguro.service.ts:96 ~ PagseguroService ~ sendPaymentData ~ user", user)
    const body = new HttpParams()
      .set('paymentMode', 'default')
      .set('paymentMethod', 'creditCard')
      .set('receiverEmail', 'contato@neocomunicacao.com.br')
      .set('currency', 'BRL')
      .set('extraAmount', '0.00')
      .set('itemId1', '0001')
      .set('itemDescription1', data.desc)
      .set('itemAmount1', data.value)
      .set('itemQuantity1', '1')
      .set('notificationURL', 'https://sualoja.com.br/notificacao.html')
      .set('reference', 'REF1234')
      .set('senderName', user.name)
      .set('senderCPF', user.cpf)
      .set('senderAreaCode', user.celular.replace(/\D/g, '').substring(0, 2))
      .set('senderPhone', user.celular.replace(/\D/g, '').substring(2, 11))
      .set('senderEmail', user.email)
      .set('senderHash', this.window.senderHash)
      .set('shippingAddressStreet', 'Av. Brig. Faria Lima')
      .set('shippingAddressNumber', '1384')
      .set('shippingAddressComplement', '5o andar')
      .set('shippingAddressDistrict', 'Jardim Paulistano')
      .set('shippingAddressPostalCode', '01452002')
      .set('shippingAddressCity', 'Sao Paulo')
      .set('shippingAddressState', 'SP')
      .set('shippingAddressCountry', 'BRA')
      .set('shippingType', '1')
      .set('shippingCost', '0.00')
      .set('creditCardToken', this.window.cardToken)
      .set('installmentQuantity', '1')
      .set('installmentValue', data.value)
      .set('creditCardHolderName', data.cardName)
      .set('creditCardHolderCPF', data.cardCPF)
      .set('creditCardHolderBirthDate', '27/10/1987')
      .set('creditCardHolderAreaCode', user.celular.replace(/\D/g, '').substring(0, 2))
      .set('creditCardHolderPhone', user.celular.replace(/\D/g, '').substring(2, 11))
      .set('billingAddressStreet', 'Av. Brig. Faria Lima')
      .set('billingAddressNumber', '1384')
      .set('billingAddressComplement', '5o andar')
      .set('billingAddressDistrict', 'Jardim Paulistano')
      .set('billingAddressPostalCode', '01452002')
      .set('billingAddressCity', 'Sao Paulo')
      .set('billingAddressState', 'SP')
      .set('billingAddressCountry', 'BRA')

    return this.http.post('https://ws.sandbox.pagseguro.uol.com.br/v2/transactions', body, {
      params: new HttpParams()
        .set('email', environment.pagSeguroEmail)
        .set('token', environment.pagSeguroToken),
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded'),
        responseType: 'text'
    }).toPromise()

  }



}
