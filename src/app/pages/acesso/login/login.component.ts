import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private _fb: FormBuilder, private session: SessionService, private messageService: MessageService, private router: Router) { }

  public loginForm: FormGroup = this._fb.group({
    password: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    const user = localStorage.getItem('pocketbase_auth');
    if(user){
      this.router.navigate(['/sistema/home']);
    }
  }

  login(){
    this.session.login(this.loginForm.value.email, this.loginForm.value.password).then((res) => {
      const user = res?.record as any;
        console.log("🚀 ~ file: login.component.ts:31 ~ LoginComponent ~ this.session.login ~ user", user)
        this.messageService.add({severity:'success', summary:'Login efetuado com sucesso!'});
        if(user.type == 'admin'){
          this.router.navigate(['/sistema/admin/home']);
        }
        else if(user.type == 'detetive'){
          this.router.navigate(['/sistema/detetive/requests']);
        }
        else{
          this.router.navigate(['/sistema/home']);
        }
    }
    ).catch((err) => {
      console.log("🚀 ~ file: login.component.ts:41 ~ LoginComponent ~ login ~ err", err)
      this.messageService.add({severity:'error', summary:'Erro ao efetuar login!'});
    }
    );
  }

}
