import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProcurementService } from '../services';
import { ProductRequest } from '../product-requests';
import { Router } from '@angular/router';
import { AtomsModule } from '../components/atoms/atoms.module';

@Component({
	selector: 'app-selection',
	providers: [ProcurementService],
	imports: [AtomsModule, NgClass],
	templateUrl: './selection.component.html',
	styleUrl: './selection.component.scss'
})

export class SelectionComponent implements OnInit {
	selected: WritableSignal<string> = signal('');
	productSchemas: WritableSignal<ProductRequest[]> = signal([]);

	constructor(private procurementService: ProcurementService, private router: Router) { }

	ngOnInit() {
		this.procurementService.getSchemas().subscribe((schemas: ProductRequest[]) => this.productSchemas.set(schemas));
	}

	setSelection(selection: string) {
		this.selected.set(selection);
	}

	goToNext() {
		this.router.navigate(['/questions'], {state: { schema: this.productSchemas().find((schema: ProductRequest) => schema.id === this.selected())}});
	}
}
