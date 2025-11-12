import { Component, OnInit } from '@angular/core';
import { CurrentSchema, SchemaService } from '../../section.service';
import { ActionButtonComponent } from '../../components/atoms/action-button/action-button.component';
import { Router } from '@angular/router';
import { Section } from '../../product-requests';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-section',
	templateUrl: './section.component.html',
	styleUrl: './section.component.scss',
	imports: [ActionButtonComponent, ReactiveFormsModule]
})
export class SectionComponent implements OnInit {
	currentSchema: CurrentSchema | undefined;
	currentSection : Section | undefined;
	sectionIndex: number = 0;
	isLastIndex: boolean = false;
	questionsForm: FormGroup | undefined;
	currentFormGroup: FormGroup | undefined;

	constructor(private router: Router, private sectionService: SchemaService) { }

	ngOnInit(): void {
		this.sectionService.getSchema$().subscribe(schema => {
			this.currentSchema = schema;
			this.sectionIndex = schema.index;
			this.isLastIndex = this.sectionIndex === schema.schema.sections.length - 1;
			this.currentSection = this.currentSchema.schema.sections[this.sectionIndex];
			this.currentFormGroup = undefined;
			setTimeout(() => {
				this.currentFormGroup = this.buildFormControls(schema.schema.sections).get(schema.schema.sections[this.sectionIndex].id) as FormGroup;
			}, 0);
		});
	}

	goToPage(pageToGo = this.sectionIndex) {
		if (!this.currentSchema) return;
		this.router.navigate([pageToGo + 1], { relativeTo: this.router.routerState.root.firstChild });
		this.sectionService.setSchema(this.currentSchema.schema, pageToGo);
	}

	buildFormControls(sections: Section[]): FormGroup {
		if (this.questionsForm) return this.questionsForm;

		this.questionsForm = new FormGroup({
			...sections.reduce((acc, section) => {
				acc[section.id] = new FormGroup({
				...section.fields.reduce((acc, field) => {
					acc[field.id] = new FormControl('');
					return acc;
				}, {} as { [key: string]: FormControl })					
				});
				return acc;
			}, {} as { [key: string]: FormGroup })
		});
		return this.questionsForm;
	}
}
