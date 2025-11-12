import { AfterViewChecked, Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
export class SectionComponent implements OnInit, AfterViewChecked {
	currentSchema: CurrentSchema | undefined;
	currentSection : Section = { id: '', title: '', fields: [] };
	sectionIndex: number = 0;
	isLastIndex: boolean = false;
	questionsForm: FormGroup | undefined;
	currentFormGroup: FormGroup | undefined;

	constructor(private router: Router, private sectionService: SchemaService, private changeDetector: ChangeDetectorRef) { }

	ngOnInit(): void {
		this.sectionService.getSchema$().subscribe(schema => {
			this.currentSchema = schema;
			this.sectionIndex = schema.index;
			this.isLastIndex = this.sectionIndex === schema.schema.sections.length - 1;
			this.currentSection = this.currentSchema.schema.sections[this.sectionIndex];
			this.currentFormGroup = undefined;
		});
	}

	ngAfterViewChecked(): void {
		if (!this.currentSchema) return;
		this.currentFormGroup = this.buildFormControls(this.currentSchema.schema.sections).get(this.currentSchema.schema.sections[this.sectionIndex].id) as FormGroup;
		this.changeDetector.detectChanges();
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
