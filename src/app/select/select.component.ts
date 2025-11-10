import { Component, OnInit } from '@angular/core';
import { IconButtonComponent } from "../components/atoms/icon-button/icon-button.component";
import { NgClass } from '@angular/common';
import { ProcurementService } from '../procurement.service';
import { ProductRequest } from '../product-requests';

@Component({
	selector: 'app-select',
	providers: [ProcurementService],
	imports: [IconButtonComponent, NgClass],
	templateUrl: './select.component.html',
	styleUrl: './select.component.scss'
})
export class SelectComponent implements OnInit {
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
