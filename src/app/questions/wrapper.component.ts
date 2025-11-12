import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductRequest } from '../product-requests';
import { SchemaService } from '../section.service';

@Component({
	selector: 'app-wrapper',
	templateUrl: './wrapper.component.html',
	styleUrl: './wrapper.component.scss',
	standalone: false,
})
export class WrapperComponent implements OnInit {
	schema: ProductRequest | undefined;
	pageIndex: number = 0;

	constructor(private router: Router, private sectionService: SchemaService) {
		const navigation = this.router.getCurrentNavigation();
		this.schema = navigation?.extras.state?.['schema'];
		this.goToPage(this.pageIndex);
		this.sectionService.setSchema(this.schema!, this.pageIndex);		
	}

	ngOnInit(): void {
		this.sectionService.getSchema$().subscribe(section => {
			this.pageIndex = section.index;
		});
	}

	goToPage(page: number) {
		this.pageIndex = page;
		this.router.navigate([this.pageIndex + 1], { relativeTo: this.router.routerState.root.firstChild });
		this.sectionService.setSchema(this.schema!, this.pageIndex);
	}
}
