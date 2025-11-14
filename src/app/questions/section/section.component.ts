import { AfterViewChecked, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SchemaService } from '../../section.service';
import { ActionButtonComponent } from '../../components/atoms/action-button/action-button.component';
import { FieldInputComponent } from '../../components/atoms/field-input/field-input.component';
import { Router } from '@angular/router';
import { ProductRequest, Section } from '../../product-requests';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProcurementService } from '../../procurement.service';

@Component({
	providers: [ProcurementService],
	selector: 'app-section',
	templateUrl: './section.component.html',
	styleUrl: './section.component.scss',
	imports: [ActionButtonComponent, ReactiveFormsModule, FieldInputComponent]
})
export class SectionComponent implements OnInit, AfterViewChecked {
	currentSection: Section = { id: '', title: '', fields: [] };
	sectionIndex: number = 0;
	isLastIndex: boolean = false;
	currentSchema: ProductRequest | undefined;
	sectionsFormGroup: FormGroup | undefined;
	currentFormGroup: FormGroup | undefined;

	constructor(private router: Router, private sectionService: SchemaService, private changeDetector: ChangeDetectorRef, private procurementService: ProcurementService) { }

	ngOnInit(): void {
		this.sectionService.getSchema$().subscribe(({ schema, index }) => {
			this.currentSchema = schema;
			this.sectionIndex = index;
			this.isLastIndex = this.sectionIndex === this.currentSchema.sections.length - 1;
			this.currentSection = this.currentSchema.sections[this.sectionIndex];
			this.currentFormGroup = undefined;
		});
	}

	ngAfterViewChecked(): void {
		if (!this.currentSchema) return;
		this.currentFormGroup = this.getOrBuildSectionsFormGroup(this.currentSchema.sections).get(this.currentSchema.sections[this.sectionIndex].id) as FormGroup;
		this.changeDetector.detectChanges();
	}

	goToPage(pageToGo = this.sectionIndex) {
		if (!this.currentSchema) return;
		this.onSubmit();
		this.router.navigate([pageToGo + 1], { relativeTo: this.router.routerState.root.firstChild });
		this.sectionService.setSchema(this.currentSchema, pageToGo);
	}

	getOrBuildSectionsFormGroup(sections: Section[]): FormGroup {
		if (this.sectionsFormGroup) return this.sectionsFormGroup;

		const sectionControls = sections.reduce((acc, section) => {
			acc[section.id] = this.buildSectionFormGroup(section);
			return acc;
		}, {} as { [key: string]: FormGroup });

		this.sectionsFormGroup = new FormGroup(sectionControls);
		return this.sectionsFormGroup;
	}

	buildSectionFormGroup(section: Section): FormGroup {
		const fieldControls = section.fields.reduce((acc, field) => {
			if (field.type === 'toggle') {
				acc[field.id] = new FormControl(field.default);
				return acc;
			}

			acc[field.id] = new FormControl('', field.required ? Validators.required : null);
			return acc;
		}, {} as { [key: string]: FormControl });

		return new FormGroup(fieldControls);
	}

	onSubmit() {
		if (!this.currentFormGroup) return;
		for (let question in this.currentFormGroup.value) {
			// Submit if question has been answered
			if (this.currentFormGroup.value[question]) {
				this.procurementService.submitRequest(this.currentSection.id, question, this.currentFormGroup.value[question]).subscribe(response => {
					console.log('Submission response:', response);
					// if (this.isLastIndex) {
					// 	this.router.navigate(['/confirmation']);
					// } else {
					// 	this.goToPage(this.sectionIndex + 1);
					// }
				});
			}
		};
	}
}
