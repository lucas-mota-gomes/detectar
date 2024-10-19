import { Component, ElementRef, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';
import { MenuItem, MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/services/loading.service';


@Component({
  selector: 'app-admin-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  @ViewChildren('menu') menuList: QueryList<ElementRef> = new QueryList<ElementRef>();
  public requestList: any[] = [];
  public menu = [] as any;
  public window = window as any;
  public editDialog = false;
  public val = false;
  public items: MenuItem[] = [{
    label: 'Menu',
    items: [
      { label: 'Editar', icon: 'pi pi-fw pi-pencil', id: 'edit', command: (event: any) => this.openEditDialog(event.item.id) },
      { label: 'Excluir', icon: 'pi pi-fw pi-trash', id: 'delete', command: () => this.deleteRequest() }
    ]
  }];
  values: any[] = [];
  selectedValue: any;
  constructor(private readonly request: RequestsService, private messageService: MessageService, private loading: LoadingService) { }

  async ngOnInit(): Promise<void> {
    this.loading.showLoading();
    await this.getRequests();
    await this.getDetectives();
    this.loading.hideLoading();
  }

  toggleMenu(index: any, event: any, id: string) {
    const menu = this.menuList.toArray()[index] as any;
    (this.items[0] as any).items[0].id = id;
    (this.items[0] as any).items[1].id = id;
    menu.toggle(event);
  }

  async getRequests() {
    console.log(this.val);
    try {
      this.requestList = await this.request.getAllRequests(!this.val ? 'status = 1' : undefined);
    } catch (error) {
      this.loading.hideLoading();
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar as requisições' });
      console.log("🚀 ~ file: home.component.ts:44 ~ HomeComponent ~ this.request.getAllRequests ~ error", error);
    }
  }

  async getDetectives() {
    try {
      this.values = await this.request.getDetectives(this.window.item?.speciality)
    } catch (error) {
      this.loading.hideLoading();
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os detetives' });
      console.log("🚀 ~ file: home.component.ts:51 ~ HomeComponent ~ this.request.getDetectives ~ error", error)
    }
  }

  openEditDialog(id: string) {
    if (this.window.item.expand.detective) {
      this.selectedValue = this.window.item.detective;
    }
    else {
      this.selectedValue = null;
    }
    this.editDialog = true;
  }

  async updateRequest() {
    this.loading.showLoading();
    this.request.updateRequest(this.window.item.id, { detective: this.selectedValue, status: this.window.item.status = 1 ? 2 : this.window.item.status }).then((response: any) => {
      this.loading.hideLoading();
      this.getRequests();
      this.editDialog = false;
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Requisição atualizada com sucesso' });
    }).catch((error: any) => {
      this.loading.hideLoading();
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível atualizar a requisição' });
      console.log("🚀 ~ file: home.component.ts:57 ~ HomeComponent ~ this.request.updateRequest ~ error", error)
    });
  }

  async deleteRequest() {
    this.loading.showLoading();
    this.request.deleteRequest(this.window.item.id).then((response: any) => {
      this.loading.hideLoading();
      this.getRequests();
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Requisição excluída com sucesso' });
    }).catch((error: any) => {
      this.loading.hideLoading();
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível excluir a requisição' });
      console.log("🚀 ~ file: home.component.ts:57 ~ HomeComponent ~ this.request.updateRequest ~ error", error)
    });
  }


}
