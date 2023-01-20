import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcessoComponent } from './components/acesso/acesso.component';
import { SistemaComponent } from './components/sistema/sistema.component';
import { CadastroComponent } from './pages/acesso/cadastro/cadastro.component';
import { LoginComponent } from './pages/acesso/login/login.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { HomeComponent } from './pages/sistema/home/home.component';
import { RequestServiceComponent } from './pages/sistema/request-service/request-service.component';
import { RequestsComponent } from './pages/sistema/requests/requests.component';
import { ServiceInfoComponent } from './pages/sistema/service-info/service-info.component';
import { UsuarioComponent } from './pages/sistema/usuario/usuario.component';
import { PagamentoComponent } from './pages/sistema/pagamento/pagamento.component';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { HomeComponent as AdminHomeComponent } from './pages/admin/home/home.component';
import { ConfigComponent } from './pages/admin/config/config.component';
import { DetectiveRequestsComponent } from './pages/detetive/detective.requests/detective.requests.component';
import { DetectiveRequestDetailComponent } from './pages/detetive/detective.request-detail/detective.request-detail.component';

const routes: Routes = [
  {
    path: 'acesso', component: AcessoComponent, children: [
      { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
      { path: 'landing-page', component: LandingPageComponent },
      { path: 'login', component: LoginComponent },
      { path: 'cadastro/:userType', component: CadastroComponent }
    ]
  },
  { path: 'sistema', component: SistemaComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'usuario', component: UsuarioComponent },
    { path: 'service-info/:id', component: ServiceInfoComponent },
    { path: 'request-service/:id', component: RequestServiceComponent },
    { path: 'requests', component: RequestsComponent },
    { path: 'pagamento/:id', component: PagamentoComponent },
    { path: 'carrinho', component: CarrinhoComponent},
    // admin home
    { path: 'admin/home', component: AdminHomeComponent },
    { path: 'admin/config', component: ConfigComponent},
    // Detetive
    { path: 'detetive/', redirectTo: 'detetive/requests', pathMatch: 'full' },
    { path: 'detetive/requests', component: DetectiveRequestsComponent },
    { path: 'detetive/requests/:id', component: DetectiveRequestDetailComponent}
  ] },
  { path: '', redirectTo: 'acesso', pathMatch: 'full' },
  { path: '**', redirectTo: 'acesso' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
