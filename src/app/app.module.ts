import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AcessoComponent } from './components/acesso/acesso.component';
import { LoginComponent } from './pages/acesso/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent as AdminHomeComponent } from './pages/admin/home/home.component';

//PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { CadastroComponent } from './pages/acesso/cadastro/cadastro.component';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SistemaComponent } from './components/sistema/sistema.component';
import { SidebarModule } from 'primeng/sidebar';
import { HomeComponent } from './pages/sistema/home/home.component';
import { UsuarioComponent } from './pages/sistema/usuario/usuario.component';
import { ServiceInfoComponent } from './pages/sistema/service-info/service-info.component';
import { RequestServiceComponent } from './pages/sistema/request-service/request-service.component';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { RequestsComponent } from './pages/sistema/requests/requests.component';
import { StepsModule } from 'primeng/steps';
import { PagamentoComponent } from './pages/sistema/pagamento/pagamento.component';
import { BadgeModule } from 'primeng/badge';
import { ToggleButtonModule } from 'primeng/togglebutton';
// dialog
import { DialogModule } from 'primeng/dialog';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { ConfigComponent } from './pages/admin/config/config.component';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { DetectiveRequestsComponent } from './pages/detetive/detective.requests/detective.requests.component';
import { DetectiveRequestDetailComponent } from './pages/detetive/detective.request-detail/detective.request-detail.component';
// carousel
import { CarouselModule } from 'primeng/carousel';
import { AuthInterceptor } from './shared/AuthInterceptor';
import { SecurePipe } from './pipes/secure.pipe';
// progress spinner
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    AcessoComponent,
    LoginComponent,
    CadastroComponent,
    SistemaComponent,
    HomeComponent,
    UsuarioComponent,
    ServiceInfoComponent,
    RequestServiceComponent,
    RequestsComponent,
    PagamentoComponent,
    CarrinhoComponent,
    ConfigComponent,
    AdminHomeComponent,
    DetectiveRequestsComponent,
    DetectiveRequestDetailComponent,
    SecurePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    CheckboxModule,
    DropdownModule,
    MultiSelectModule,
    BrowserAnimationsModule,
    InputTextareaModule,
    InputMaskModule,
    ToastModule,
    SidebarModule,
    FileUploadModule,
    HttpClientModule,
    StepsModule,
    DialogModule,
    BadgeModule,
    MenuModule,
    TagModule,
    CarouselModule,
    ProgressSpinnerModule,
    ToggleButtonModule
  ],
  providers: [
    MessageService,
    AuthInterceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
