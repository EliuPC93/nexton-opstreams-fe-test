import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductRequest } from '../product-requests';
import { SchemaService } from '../services';

@Component({
	selector: 'app-wrapper',
	templateUrl: './wrapper.component.html',
	styleUrl: './wrapper.component.scss',
	standalone: false,
})
export class WrapperComponent implements OnInit {
	schema: ProductRequest | undefined;
	pageIndex: WritableSignal<number> = signal(0);

	constructor(private router: Router, private sectionService: SchemaService) {
		const navigation = this.router.currentNavigation();
		this.schema = navigation?.extras.state?.['schema'];
		this.sectionService.setSchema(this.schema!, this.pageIndex());		
	}

	ngOnInit(): void {
		this.sectionService.getSchema$().subscribe(section => {
			this.pageIndex.set(section.index);
		});
	}
}
