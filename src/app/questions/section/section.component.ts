import { AfterViewChecked, Component, OnInit, ChangeDetectorRef, signal, WritableSignal, computed, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, of, retry, tap } from 'rxjs';
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
	currentSection: WritableSignal<Section> = signal({ id: '', title: '', fields: [] });
	sectionIndex:  WritableSignal<number> = signal(0);
	isLastIndex: WritableSignal<boolean> = signal(false);
	currentSchema: WritableSignal<ProductRequest> = signal({id: "software-request", title: "", sections: []});
	sectionsFormGroup: Signal<FormGroup> = computed(() => this.getOrBuildSectionsFormGroup(this.currentSchema().sections));
	currentFormGroup: FormGroup | undefined;
	savingState: WritableSignal<{label: string, isComplete: boolean}> = signal({ label: '', isComplete: false });
	maxRetries = 3;

	constructor(
		private router: Router,
		private sectionService: SchemaService,
		private changeDetector: ChangeDetectorRef,
		private procurementService: ProcurementService,
		private summaryService: AnswersService,
	) { }

	ngOnInit(): void {
		this.sectionService.getSchema$().subscribe(({ schema, index }) => {
			this.currentSchema.set(schema);
			this.sectionIndex.set(index);
			this.isLastIndex.set(index === schema.sections.length - 1);
			this.currentSection.set(schema.sections[index]);
			this.currentFormGroup = undefined;
		});
	}

	ngAfterViewChecked(): void {
		if (!this.currentSchema().sections.length) return;
		this.currentFormGroup = this.sectionsFormGroup().get(this.currentSection().id) as FormGroup;
		this.changeDetector.detectChanges();
	}

	goToPage(pageToGo = this.sectionIndex()) {
		this.router.navigate([pageToGo + 1], { relativeTo: this.router.routerState.root.firstChild });
		this.sectionService.setSchema(this.currentSchema(), pageToGo);
	}

	getOrBuildSectionsFormGroup(sections: Section[]): FormGroup {
		const sectionControls = sections.reduce((acc, section) => {
			acc[section.id] = this.buildSectionFormGroup(section);
			return acc;
		}, {} as { [key: string]: FormGroup });

		return new FormGroup(sectionControls);
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
		forkJoin(this.buildSubmissionRequests()).pipe(
			tap(() => this.savingState.set({ label: "SAVING", isComplete: false })),
			retry({
				count: this.maxRetries,
				delay: () => {
					this.savingState.set({ label: "RETRYING", isComplete: false });
					return of(null);
				}
			})).subscribe({
				next: ((response: Answer[]) => this.handleSubmissionSuccess(response, this.router)),
				error: (this.handleSubmissionError),
			});
	}

	private buildSubmissionRequests() {
		if (!this.sectionsFormGroup) return [];

		const requests: Observable<Answer>[] = [];

		for (const sectionId in this.sectionsFormGroup().value) {
			const sectionAnswers = this.sectionsFormGroup().value[sectionId];

			for (const questionId in sectionAnswers) {
				const answer = sectionAnswers[questionId];
				const request: Observable<Answer> = this.procurementService.submitRequest(sectionId, questionId, answer);
				requests.push(request);
			}
		}

		return requests;
	}

	public handleSubmissionSuccess(unmappedAnswers: Answer[], router: Router) {
		this.savingState.set({ label: 'SAVED', isComplete: true });
		const answers = unmappedAnswers.map((answer: Answer) => ({
			...answer,
			title: this.getQuestionTitle(answer.id)
		}));

		this.summaryService.setAnswers(answers);
		router.navigate(["summary"]);
	}

	public getQuestionTitle(questionId: number | string): string {
		for (const section of this.currentSchema().sections) {
			const field = section.fields.find((field: Field) => field.id === questionId);
			if (field) return field.label;
		}
		return '';
	}

	public handleSubmissionError(error: any) {
		console.error(error);
		this.savingState.set({ label: 'ERROR', isComplete: true });
	}
}
