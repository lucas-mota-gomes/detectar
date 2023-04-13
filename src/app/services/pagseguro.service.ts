import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class PagseguroService {

  window = window as any;

  constructor(private http: HttpClient, private loadingService: LoadingService) {
    // this.pay();
  }

  // get the pagseguro session id
  getSessionId() {
    const headers = {
      'Content-Type': 'application/xml',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Credentials': 'true'
    };
    try {
      setTimeout(() => {
        this.loadingService.showLoading();
      }, 500);
      this.http.post(`${environment.pagSeguroApi}?email=${environment.pagSeguroEmail}&token=${environment.pagSeguroToken}`, {}, { headers: headers, responseType: 'text' }).pipe().subscribe(async (res: any) => {
        //get <id> between <id> and </id>
        res = res.match(/<id>(.*?)<\/id>/)[1];
        this.window.PagSeguroDirectPayment.setSessionId(res);
        await this.getPaymentMethods();
        await this.getSenderHash();
        this.loadingService.hideLoading();
      });
    } catch (error) {
      this.loadingService.hideLoading();
    }

  }

  async getPaymentMethods() {
    return new Promise((resolve, reject) => {
      this.window.PagSeguroDirectPayment.getPaymentMethods({
        amount: 500.00,
        success: function (response: any) {
          // Retorna os meios de pagamento disponíveis.
          resolve(response);
        },
        error: function (response: any) {
          // Callback para chamadas que falharam.
          reject(response);
        }
      });
    });
  }

  async getSenderHash() {
    return new Promise((resolve, reject) => {
      try {
        this.window.PagSeguroDirectPayment.onSenderHashReady((response: any) => {
          if (response.status == 'error') {
            console.log(response.message);
            reject(false);
          }
          var hash = response.senderHash; //Hash estará disponível nesta variável.
          this.window.senderHash = hash;
          resolve(hash);
        });
      } catch (error) {
        console.log("🚀 ~ file: pagseguro.service.ts:62 ~ PagseguroService ~ getSenderHash ~ error:", error);
        reject(error);
      }
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
          reject(new Error("Erro ao gerar token do cartão"));
        }
      });
    }
    );
  }

  pay(card: any, userData:any, productData: any) {
    var card = this.window.PagSeguro.encryptCard({
      publicKey: environment.pagSeguroPublicKey,
      holder: card.holder,
      number: card.number,
      expMonth: card.expMonth,
      expYear: card.expYear,
      securityCode: card.securityCode
    });

    var encrypted = card.encryptedCard;

    var data = {
      "reference_id": "ex-00001",
      "customer": {
        "name": userData.name,
        "email": userData.email,
        "tax_id": "87062697028",
        "phones": [
          {
            "country": "55",
            "area": "31",
            "number": "992992293",
            "type": "MOBILE"
          }
        ]
      },
      "items": [
        {
          "reference_id": productData.id,
          "name": productData.expand.speciality.label,
          "quantity": 1,
          "unit_amount": productData.expand.speciality.value
        }
      ],
      "shipping": {
        "address": {
          "street": "Avenida Brigadeiro Faria Lima",
          "number": "1384",
          "complement": "apto 12",
          "locality": "Pinheiros",
          "city": "São Paulo",
          "region_code": "SP",
          "country": "BRA",
          "postal_code": "01452002"
        }
      },
      "notification_urls": [
        "https://meusite.com/notificacoes"
      ],
      "charges": [
        {
          "reference_id": productData.id,
          "description": "Serviço de consulta",
          "amount": {
            "value": productData.expand.speciality.value,
            "currency": "BRL"
          },
          "payment_method": {
            "type": "CREDIT_CARD",
            "installments": 1,
            "capture": true,
            "card": {
              "encrypted": encrypted,
              "security_code": card.securityCode,
              "holder": {
                "name": card.holder,
              },
              "store": false
            }
          }
        }
      ]
    }

    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'FC80C5328AA34CF7AC80CB0F49A4A845'
    });

    return this.http.post('https://oracle.garrysmod.com.br/https://sandbox.api.pagseguro.com/orders', data, {headers}).toPromise();
  }

  sendPaymentData(data: any, userData: any) {
    const body = new HttpParams()
      .set('paymentMode', 'default')
      .set('paymentMethod', 'creditCard')
      .set('receiverEmail', 'admin@uailegends.com.br')
      .set('currency', 'BRL')
      .set('extraAmount', '0.00')
      .set('itemId1', '0001')
      .set('itemDescription1', data.desc)
      .set('itemAmount1', data.value.toFixed(2))
      .set('itemQuantity1', '1')
      .set('notificationURL', 'https://sualoja.com.br/notificacao.html')
      .set('reference', 'REF1234')
      .set('senderName', userData.name + ' ' + userData.lastName)
      .set('senderCPF', '60118187066')
      .set('senderAreaCode', '31')
      .set('senderPhone', '992992292')
      .set('senderEmail', userData.email)
      .set('senderHash', this.window.senderHash)
      .set('shippingAddressStreet', userData.address)
      .set('shippingAddressNumber', userData.number)
      .set('shippingAddressComplement', userData.complement ? userData.complement : 'N/A')
      .set('shippingAddressDistrict', userData.bairro)
      .set('shippingAddressPostalCode', userData.cep)
      .set('shippingAddressCity', userData.city)
      .set('shippingAddressState', userData.state)
      .set('shippingAddressCountry', 'BRA')
      .set('shippingType', '1')
      .set('shippingCost', '0.00')
      .set('creditCardToken', this.window.cardToken)
      .set('installmentQuantity', '1')
      .set('installmentValue', data.value.toFixed(2))
      .set('creditCardHolderName', data.cardName)
      .set('creditCardHolderCPF', data.cardCPF)
      .set('creditCardHolderBirthDate', '27/10/1987')
      .set('creditCardHolderAreaCode', '31')
      .set('creditCardHolderPhone', '992992292')
      .set('billingAddressStreet', userData.address)
      .set('billingAddressNumber', userData.number)
      .set('billingAddressComplement', userData.complement ? userData.complement : 'N/A')
      .set('billingAddressDistrict', userData.bairro)
      .set('billingAddressPostalCode', userData.cep)
      .set('billingAddressCity', userData.city)
      .set('billingAddressState', userData.state)
      .set('billingAddressCountry', 'BRA')

    return this.http.post('https://oracle.garrysmod.com.br/https://ws.sandbox.pagseguro.uol.com.br/v2/transactions', body, {
      params: new HttpParams()
        .set('email', environment.pagSeguroEmail)
        .set('token', environment.pagSeguroToken),
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text'
    }).toPromise()

  }

}


