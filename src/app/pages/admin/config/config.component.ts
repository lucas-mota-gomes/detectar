import { Component, ElementRef, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { SpecialitiesService } from 'src/app/services/specialities.service';
import { MenuItem } from 'primeng/api';

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
  public items: MenuItem[] = [{
    label: 'Menu',
    items: [
      { label: 'Editar', icon: 'pi pi-fw pi-pencil', command: (event) => this.editItem(event.item.id), id: 'edit'},
      { label: 'Excluir', icon: 'pi pi-fw pi-trash' }
    ]
  }];

  constructor(private readonly speacialityService: SpecialitiesService) { }

  ngOnInit(): void {
    this.getSpecialities();
  }

  getSpecialities() {
    this.speacialityService.getSpecialities().then((res) => {
      console.log("🚀 ~ file: config.component.ts:18 ~ ConfigComponent ~ this.speacialityService.getSpecialities ~ res", res)
      this.specialityList = res;
    }).catch((err) => {
      console.log(err);
    });
  }

  toggleMenu(index: any, event: any, id: string){
    const menu = this.menuList.toArray()[index] as any;
    (this.items[0] as any).items[0].id = id;
    menu.toggle(event);
  }

  log(event: any){
    console.log(event);
  }

  editItem(id: string){
    console.log(id);
    this.editDialog = true;
  }

}
