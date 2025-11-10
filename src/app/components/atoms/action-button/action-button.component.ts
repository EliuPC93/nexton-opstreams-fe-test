import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-action-button',
	imports: [NgClass],
	templateUrl: './action-button.component.html',
	styleUrl: './action-button.component.scss'
})
export class ActionButtonComponent {
	@Input() label: string = '';
	@Input() variant: string = '';
}
