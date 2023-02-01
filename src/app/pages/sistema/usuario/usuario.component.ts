import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/services/loading.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  public user: any;
  public resetForm = false;
  constructor(private session: SessionService, private loading: LoadingService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.user = this.session.getUser();
  }

  requestPasswordReset(){
    this.loading.showLoading();
    this.session.resetPass(this.user.email).then((res: any) => {
      this.resetForm = false;
      this.loading.hideLoading();
      this.messageService.add({severity:'success', summary:'Email enviado com sucesso!', detail: 'Verifique sua caixa de entrada!'});
    }).catch((err: any) => {
      this.resetForm = false;
      this.loading.hideLoading();
      this.messageService.add({severity:'error', summary:'Erro ao enviar email!'});
    });
  }

}
