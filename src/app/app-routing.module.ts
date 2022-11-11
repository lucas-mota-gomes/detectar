import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcessoComponent } from './components/acesso/acesso.component';
import { LoginComponent } from './pages/acesso/login/login.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

const routes: Routes = [
  {path: 'acesso', component: AcessoComponent, children: [
    {path: 'landing-page', component: LandingPageComponent},
    {path: 'login', component: LoginComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
