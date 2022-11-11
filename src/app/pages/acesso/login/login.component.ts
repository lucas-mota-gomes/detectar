import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private _fb: FormBuilder) { }

  public loginForm: FormGroup = this._fb.group({
    password: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
  }

}
