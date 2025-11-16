import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-action-button',
	templateUrl: './action-button.component.html',
	styleUrl: './action-button.component.scss',
    standalone: false,
})
export class ActionButtonComponent {
	@Input() label: string = '';
	@Input() variant: string = '';
	@Input() isDisabled: boolean = false;
	@Input() type: 'button' | 'submit' = 'button';
}
