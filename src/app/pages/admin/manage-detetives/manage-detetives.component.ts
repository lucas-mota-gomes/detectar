import { Component, ElementRef, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';
import { MenuItem, MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/services/loading.service';
import { SessionService } from 'src/app/services/session.service';


@Component({
  selector: 'app-manage-detetives',
  standalone: false,
  templateUrl: './manage-detetives.component.html',
  styleUrl: './manage-detetives.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ManageDetetivesComponent implements OnInit {
  @ViewChildren('menu') menuList: QueryList<ElementRef> = new QueryList<ElementRef>();
  public requestList: any[] = [];
  public menu = [] as any;
  public window = window as any;
  public editDialog = false;
  public val = false;
  public items: MenuItem[] = [{
    label: 'Menu',
    items: [
      { label: false ? 'Desativar' : 'Ativar', icon: 'pi pi-fw pi-pencil', id: 'edit', status: true, command: (event: any) => this.disableUser(event.item.id, event.item.status) },
    ]
  }];
  values: any[] = [];
  selectedValue: any;
  constructor(private readonly request: RequestsService, private messageService: MessageService, private loading: LoadingService, private readonly sessionService: SessionService) { }

  async ngOnInit(): Promise<void> {
    this.loading.showLoading();
    await this.getDetectives();
    this.loading.hideLoading();
  }

  updateMenuItem(item: any){
    this.items = [{
      label: 'Menu',
      items: [
        { label: item.active ? 'Desativar' : 'Ativar', icon: 'pi pi-fw pi-pencil', id: 'edit', status: true, command: (event: any) => this.disableUser(event.item.id, event.item.status) },
      ]
    }];
  }

  toggleMenu(index: any, event: any, id: string, status: boolean) {
    const menu = this.menuList.toArray()[index] as any;
    (this.items[0] as any).items[0].id = id;
    (this.items[0] as any).items[0].status = status;
    menu.toggle(event);
  }

  async getDetectives() {
    try {
      this.values = await this.request.getAllDetectives()
      console.log("🚀 ~ ManageDetetivesComponent ~ getDetectives ~ values:", this.values)
    } catch (error) {
      this.loading.hideLoading();
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os detetives' });
      console.log("🚀 ~ file: home.component.ts:51 ~ HomeComponent ~ this.request.getDetectives ~ error", error)
    }
  }

  async disableUser(userId: string, status: boolean) {
    this.loading.showLoading();
    this.sessionService.disableUser(userId, status).then(async (response: any) => {
      await this.ngOnInit();
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Detetive desativado com sucesso' });
    }).catch((error: any) => {
      this.loading.hideLoading();
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível desativar o detetive' });
      console.log("🚀 ~ file: home.component.ts:57 ~ HomeComponent ~ this.request.updateRequest ~ error", error)
    });
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

}
