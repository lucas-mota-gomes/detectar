import { Component, ElementRef, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { SpecialitiesService } from 'src/app/services/specialities.service';
import { MenuItem, MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigComponent implements OnInit {
  @ViewChildren('menu') menuList: QueryList<ElementRef> = new QueryList<ElementRef>();

  public specialityList: any;
  public menu = [] as any;
  public editDialog = false;
  public newDialog = false;
  public window = window as any;
  public itemValue = 0;
  public formData = new FormData();
  public itemLabel = ''
  public description = '';
  public items: MenuItem[] = [{
    label: 'Menu',
    items: [
      { label: 'Editar', icon: 'pi pi-fw pi-pencil', command: (event) => this.editItem(event.item.id), id: 'edit' },
      { label: 'Excluir', icon: 'pi pi-fw pi-trash', command: (event) => this.delete(event.item.id) }
    ]
  }];

  constructor(private readonly speacialityService: SpecialitiesService, private readonly messageService: MessageService, private loading: LoadingService) { }

  ngOnInit(): void {
    this.getSpecialities();
  }

  getSpecialities() {
    this.loading.showLoading();
    this.speacialityService.getSpecialities().then((res) => {
      this.loading.hideLoading();
      this.specialityList = res;
    }).catch((err) => {
      this.loading.hideLoading();
      console.log(err);
    });
  }

  toggleMenu(index: any, event: any, id: string) {
    const menu = this.menuList.toArray()[index] as any;
    (this.items[0] as any).items[0].id = id;
    (this.items[0] as any).items[1].id = id;
    menu.toggle(event);
  }

  log(event: any) {
    console.log(event);
  }

  editItem(id: string) {
    this.itemValue = this.window.item?.value;
    this.itemLabel = this.window.item?.label;
    this.editDialog = true;
  }

  newItemDialog() {
    this.itemValue = 0;
    this.itemLabel = '';
    this.newDialog = true;
  }

  saveItem() {
    this.loading.showLoading();
    this.formData.append('value', this.itemValue.toString());
    this.formData.append('label', this.itemLabel);
    this.formData.append('description', this.description);
    this.speacialityService.editSpeciality(this.window.item?.id, this.formData).then((res) => {
      this.loading.hideLoading();
      // console.log("🚀 ~ file: config.component.ts:18 ~ ConfigComponent ~ this.speacialityService.getSpecialities ~ res", res)
      this.getSpecialities();
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Item editado com sucesso!' });
    }).catch((err) => {
      this.loading.hideLoading();
      console.log(err);
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao editar item!' });
    });
    this.editDialog = false;
    this.formData = new FormData();
  }

  newItem() {
    this.loading.showLoading();
    this.formData.append('value', this.itemValue.toString());
    this.formData.append('label', this.itemLabel);
    this.formData.append('description', this.description);
    this.speacialityService.createSpeciality(this.formData).then((res) => {
      this.loading.hideLoading();
      // console.log("🚀 ~ file: config.component.ts:18 ~ ConfigComponent ~ this.speacialityService.getSpecialities ~ res", res)
      this.getSpecialities();
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Item criado com sucesso!' });
    }).catch((err) => {
      this.loading.hideLoading();
      console.log(err);
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar item!' });
    });
    this.newDialog = false;
    this.formData = new FormData();
  }

  anexar(event: any) {
    const files = event.target.files;
    this.formData.append('image', files[0]);
  }

  delete(id: string) {
    this.loading.showLoading();
    this.speacialityService.deleteSpeciality(id).then((res) => {
      this.loading.hideLoading();
      // console.log("🚀 ~ file: config.component.ts:18 ~ ConfigComponent ~ this.speacialityService.getSpecialities ~ res", res)
      this.getSpecialities();
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Item excluído com sucesso!' });
    }).catch((err) => {
      this.loading.hideLoading();
      console.log(err);
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir item!' });
    });
  }

}
