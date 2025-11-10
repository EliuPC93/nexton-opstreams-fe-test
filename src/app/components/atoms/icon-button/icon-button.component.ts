import { Component, Input } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-icon-button',
  imports: [NgClass],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss'
})
export class IconButtonComponent {
  @Input() iconName: string = '';
  @Input() label: string = '';

}
