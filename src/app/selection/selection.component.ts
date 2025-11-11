import { Component, OnInit } from '@angular/core';
import { IconButtonComponent } from "../components/atoms/icon-button/icon-button.component";
import { NgClass } from '@angular/common';
import { ProcurementService } from '../procurement.service';
import { ProductRequest } from '../product-requests';
import { ActionButtonComponent } from '../components/atoms/action-button/action-button.component';

@Component({
	selector: 'app-selection',
	providers: [ProcurementService],
	imports: [IconButtonComponent, ActionButtonComponent, NgClass],
	templateUrl: './selection.component.html',
	styleUrl: './selection.component.scss'
})

export class SelectionComponent implements OnInit {
	selected: string = '';
	productSchemas: ProductRequest[] = [];

	constructor(private procurementService: ProcurementService) { }

	ngOnInit() {
		this.procurementService.getSchemas().subscribe((schemas: ProductRequest[]) => this.productSchemas = schemas);
	}

	setSelection(selection: string) {
		this.selected = selection;
	}
}
