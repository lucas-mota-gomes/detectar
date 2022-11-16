import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  public user: any;
  constructor(private session: SessionService) { }

  ngOnInit(): void {
    this.user = this.session.getUser();
  }

}
