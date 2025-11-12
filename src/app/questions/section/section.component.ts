import { Component, OnInit } from '@angular/core';
import { CurrentSchema, SchemaService } from '../../section.service';
import { ActionButtonComponent } from '../../components/atoms/action-button/action-button.component';
import { Router } from '@angular/router';
import { Field } from '../../product-requests';

@Component({
	selector: 'app-section',
	templateUrl: './section.component.html',
	styleUrl: './section.component.scss',
	imports: [ActionButtonComponent]
})
export class SectionComponent implements OnInit {
	currentSchema: CurrentSchema | undefined;
	sectionIndex: number = 0;
	isLastIndex: boolean = false;

	constructor(private router: Router, private sectionService: SchemaService) {}

	ngOnInit(): void {
		this.sectionService.getSchema$().subscribe(schema => {
			console.log('Received schema via service:', schema);
			this.currentSchema = schema;
			this.sectionIndex = schema.index;
			this.isLastIndex = schema.index === schema.schema.sections.length - 1;
		});
	}

	getSectionTitle(): string {
		if (!this.currentSchema) return '';
		return this.currentSchema.schema.sections[this.currentSchema.index].title;
	}

	goToPage(pageToGo = this.sectionIndex) {
		if (!this.currentSchema) return;
		this.router.navigate([pageToGo + 1], { relativeTo: this.router.routerState.root.firstChild });
		this.sectionService.setSchema(this.currentSchema.schema, pageToGo);
	}

	getSectionFields(): Field[] {
		if (!this.currentSchema) return [];
		return this.currentSchema.schema.sections[this.currentSchema.index].fields;
	}
}
