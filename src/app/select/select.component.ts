import { Component } from '@angular/core';
import { IconButtonComponent } from "../components/atoms/icon-button/icon-button.component";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-select',
  imports: [IconButtonComponent, NgClass],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent {

  selected: string = '';

  setSelection(selection: string) {
    this.selected = selection;
  }
}
