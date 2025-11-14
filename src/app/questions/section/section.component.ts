import { AfterViewChecked, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ActionButtonComponent } from '../../components/atoms/action-button/action-button.component';
import { FieldInputComponent } from '../../components/atoms/field-input/field-input.component';
import { ProductRequest, Section } from '../../product-requests';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProcurementService, AnswerService, Answer, SchemaService } from '../../services';

@Component({
	providers: [ProcurementService, AnswerService],
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

	constructor(
		private router: Router,
		private sectionService: SchemaService,
		private changeDetector: ChangeDetectorRef,
		private procurementService: ProcurementService,
		private answerService: AnswerService,
	) { }

	ngOnInit(): void {
		this.sectionService.getSchema$().subscribe(({ schema, index }) => {
			this.currentSchema = schema;
			this.sectionIndex = index;
			this.isLastIndex = this.sectionIndex === schema.sections.length - 1;
			this.currentSection = schema.sections[this.sectionIndex];
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
		if (!this.sectionsFormGroup || !this.currentSchema) return;

		const submissionRequests = this.buildSubmissionRequests();

		if (submissionRequests.length === 0) {
			console.warn('No answers to submit');
			return;
		}

		forkJoin(submissionRequests).subscribe({
			next: (this.handleSubmissionSuccess),
			error: (this.handleSubmissionError),
		});
	}

	private buildSubmissionRequests() {
		const requests = [];

		for (const sectionId in this.sectionsFormGroup!.value) {
			const sectionAnswers = this.sectionsFormGroup!.value[sectionId];

			for (const questionId in sectionAnswers) {
				const answer = sectionAnswers[questionId];
				const request = this.procurementService.submitRequest(sectionId, questionId, answer);
				requests.push(request);
			}
		}

		return requests;
	}

	private handleSubmissionSuccess(responses: Answer[]) {
		if (this.isLastIndex) {
			this.answerService.setAnswers(responses);
			// Navigate to confirmation or final page
			console.log('Form submission complete. Navigating to confirmation.');
			// this.router.navigate(['/confirmation']);
		}
	}

	private handleSubmissionError(error: any) {
		console.error('Failed to submit form:', error);
		// TODO: Show user-facing error message (toast/snackbar)
	}
}
