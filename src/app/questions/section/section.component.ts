import { AfterViewChecked, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { concatMap, filter, forkJoin, Observable, tap, timer } from 'rxjs';
import { Field, ProductRequest, Section, Answer } from '../../product-requests';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProcurementService, SchemaService, AnswersService } from '../../services';

@Component({
	selector: 'app-section',
	templateUrl: './section.component.html',
	styleUrl: './section.component.scss',
	standalone: false
})
export class SectionComponent implements OnInit, AfterViewChecked {
	currentSection: Section = { id: '', title: '', fields: [] };
	sectionIndex: number = 0;
	isLastIndex: boolean = false;
	currentSchema: ProductRequest | undefined;
	sectionsFormGroup: FormGroup | undefined;
	currentFormGroup: FormGroup | undefined;
	savingState = {label: '', isComplete: false};

	constructor(
		private router: Router,
		private sectionService: SchemaService,
		private changeDetector: ChangeDetectorRef,
		private procurementService: ProcurementService,
		private summaryService: AnswersService,
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

	autoSubmitField(fieldId: number) {
		const answer = this.currentFormGroup?.value[fieldId];

		timer(1000)
			.pipe(
				filter(() => this.isValidAnswer(answer)),
				tap(()=> this.savingState = {label: "SAVING", isComplete: false}),
				concatMap(() => this.procurementService.submitRequest(this.currentSection.id, fieldId.toString(), answer)))
			.subscribe({
				complete: () => this.savingState = { label: 'SAVED', isComplete: true },
				error: () => this.savingState = { label: 'ERROR SAVING', isComplete: true }
			}
		);
	}

	onSubmit() {
		forkJoin(this.buildSubmissionRequests()).subscribe({
			next: ((response: Answer[]) => this.handleSubmissionSuccess(response, this.router)),
			error: (this.handleSubmissionError),
		});
	}

	private buildSubmissionRequests() {
		if (!this.sectionsFormGroup) return [];

		const requests: Observable<Answer>[] = [];

		for (const sectionId in this.sectionsFormGroup!.value) {
			const sectionAnswers = this.sectionsFormGroup!.value[sectionId];

			for (const questionId in sectionAnswers) {
				const answer = sectionAnswers[questionId];
				if (!this.isValidAnswer(answer)) continue;
				const request: Observable<Answer> = this.procurementService.submitRequest(sectionId, questionId, answer);
				requests.push(request);
			}
		}

		return requests;
	}

	/**
	 * Determine whether a form answer is valid and should be submitted.
	 * - Strings: non-empty after trim
	 * - Numbers: not NaN
	 * - Booleans: always valid
	 * - null/undefined/empty string: invalid
	 */
	private isValidAnswer(value: unknown): boolean {
		if (value === null || value === undefined) return false;
		if (typeof value === 'string') return value.trim() !== '';
		if (typeof value === 'number') return !isNaN(value);
		if (typeof value === 'boolean') return true;
		return false;
	}

	public handleSubmissionSuccess(unmappedAnswers: Answer[], router: Router) {
		const answers = unmappedAnswers.map((answer: Answer) => ({
			...answer,
			title: this.getQuestionTitle(answer.id)
		}));

		this.summaryService.setAnswers(answers);
		router.navigate(["summary"]);
	}

	public getQuestionTitle(questionId: number | string): string {
		if (!this.currentSchema) return '';

		for (const section of this.currentSchema.sections) {
			const field = section.fields.find((field: Field) => field.id === questionId);
			if (field) return field.label;
		}
		return '';
	}

	private handleSubmissionError(error: any) {
		console.error('Failed to submit form:', error);
		// TODO: Show user-facing error message (toast/snackbar)
	}
}
