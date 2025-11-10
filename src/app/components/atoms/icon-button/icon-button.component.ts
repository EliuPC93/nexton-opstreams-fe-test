import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
	selector: 'app-icon-button',
	imports: [NgClass],
	templateUrl: './icon-button.component.html',
	styleUrl: './icon-button.component.scss'
})
export class IconButtonComponent {
	@Input() key: string = '';
	@Output() select = new EventEmitter<string>();

	onSelect() {
		this.select.emit(this.key);
	}

	getClass(value: string): string {
		return value.toLocaleLowerCase().slice(0, value.indexOf('-'));
	}

	getLabel(value: string): string {
		return value.charAt(0).toUpperCase() + this.getClass(value).slice(1);
	}
}
