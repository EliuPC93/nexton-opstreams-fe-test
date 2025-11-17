import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Section } from '../product-requests';
import { CurrentSchema, SchemaService } from '../services';

@Component({
	selector: 'app-wrapper',
	templateUrl: './wrapper.component.html',
	styleUrl: './wrapper.component.scss',
	standalone: false,
})
export class WrapperComponent implements OnInit {
	sections: WritableSignal<Section[]> = signal([]);
	pageIndex: WritableSignal<number> = signal(0);

	constructor(private router: Router, private sectionService: SchemaService) {
		const navigation = this.router.currentNavigation();
		this.sectionService.setSchema(navigation?.extras.state?.['schema'], this.pageIndex());		
	}

	ngOnInit(): void {
		this.sectionService.getSchema$().subscribe((section: CurrentSchema) => {
			this.sections.set(section.schema.sections);
			this.pageIndex.set(section.index);
		});
	}
}
