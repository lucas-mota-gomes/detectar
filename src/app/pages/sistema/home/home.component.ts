import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  public specialities: any[] = [
    {label: 'Varredura Telefônica', value: 0, img: 'assets/img/varredura.png', type: 0},
    {label: 'Teste de Fidelidade', value: 1, img: 'assets/img/heart.png', type: 1},
    {label: 'Localização de Veículos', value: 2, img: 'assets/img/car.png', type: 0},
    {label: 'Localização de Pessoas', value: 3, img: 'assets/img/people.png', type: 0},
    {label: 'Investigação Empresarial', value: 4, img: 'assets/img/business.png', type: 1},
    {label: 'Investigação de Paternidade', value: 5, img: 'assets/img/father.png', type: 0},
    {label: 'Investigação de Conjugal', value: 6, img: 'assets/img/marriage.png', type: 0},
    {label: 'Inteligência e conta-inteligência', value: 7, img: 'assets/img/intelligence.png', type: 1},
    {label: 'Cumprimento de mandado', value: 8, img: 'assets/img/mandate.png', type: 0},
    {label: 'Investigação Criminal', value: 9, img: 'assets/img/criminal.png', type: 0},
    {label: 'Crimes Cibernéticos', value: 10, img: 'assets/img/cybercrime.png', type: 1},
    {label: 'Outros', value: 11, img: 'assets/img/other.png', type: 0},
  ];

  ngOnInit(): void {
  }

}
