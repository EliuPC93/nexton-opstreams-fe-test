import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryComponent } from './summary.component';
import { Router } from '@angular/router';
import { AnswersService } from '../services';
import { Answer } from '../product-requests';

describe('SummaryComponent', () => {
	let component: SummaryComponent;
	let fixture: ComponentFixture<SummaryComponent>;
	let mockRouter: jasmine.SpyObj<Router>;
	let mockAnswersService: jasmine.SpyObj<AnswersService>;

	const mockAnswers: Answer[] = [
		{ id: 1, value: 'Test Answer 1', title: 'Question 1' },
		{ id: 2, value: 'Test Answer 2', title: 'Question 2' }
	];

	beforeEach(async () => {
		mockRouter = jasmine.createSpyObj('Router', ['navigate']);
		mockAnswersService = jasmine.createSpyObj('AnswersService', ['getAnswers', 'setAnswers']);

		await TestBed.configureTestingModule({
			imports: [SummaryComponent],
			providers: [
				{ provide: Router, useValue: mockRouter },
				{ provide: AnswersService, useValue: mockAnswersService }
			]
		})
			.compileComponents();

		fixture = TestBed.createComponent(SummaryComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should get answers from AnswersService', () => {
			mockAnswersService.getAnswers.and.returnValue(mockAnswers);

			component.ngOnInit();

			expect(mockAnswersService.getAnswers).toHaveBeenCalled();
			expect(component.answers).toEqual(mockAnswers);
		});

		it('should navigate to select if no answers available', () => {
			mockAnswersService.getAnswers.and.returnValue([]);

			component.ngOnInit();

			expect(mockRouter.navigate).toHaveBeenCalledWith(['select']);
		});

		it('should not navigate if answers are available', () => {
			mockAnswersService.getAnswers.and.returnValue(mockAnswers);

			component.ngOnInit();

			expect(mockRouter.navigate).not.toHaveBeenCalled();
		});
	});

	describe('resetSummary method', () => {
		it('should clear answers in service', () => {
			component.resetSummary();

			expect(mockAnswersService.setAnswers).toHaveBeenCalledWith([]);
		});

		it('should navigate to select flow', () => {
			component.resetSummary();

			expect(mockRouter.navigate).toHaveBeenCalledWith(['select']);
		});

		it('should call both setAnswers and navigate', () => {
			component.resetSummary();

			expect(mockAnswersService.setAnswers).toHaveBeenCalledWith([]);
			expect(mockRouter.navigate).toHaveBeenCalledWith(['select']);
		});
	});

	describe('isValidAnswer method', () => {
		it('should return true for non-empty string', () => {
			expect(component.isValidAnswer('test')).toBe(true);
		});

		it('should return true for number', () => {
			expect(component.isValidAnswer(42)).toBe(true);
		});

		it('should return true for true boolean', () => {
			expect(component.isValidAnswer(true)).toBe(true);
		});

		it('should return true for false boolean', () => {
			expect(component.isValidAnswer(false)).toBe(true);
		});

		it('should return false for empty string', () => {
			expect(component.isValidAnswer('')).toBe(false);
		});

		it('should return false for null', () => {
			expect(component.isValidAnswer(null)).toBe(false);
		});

		it('should return false for undefined', () => {
			expect(component.isValidAnswer(undefined)).toBe(false);
		});

		it('should return false for 0', () => {
			expect(component.isValidAnswer(0)).toBe(false);
		});

		it('should return true for object', () => {
			expect(component.isValidAnswer({ key: 'value' })).toBe(true);
		});

		it('should return true for array', () => {
			expect(component.isValidAnswer([1, 2, 3])).toBe(true);
		});
	});

	describe('restartFlow method', () => {
		it('should navigate to select', () => {
			component.restartFlow();

			expect(mockRouter.navigate).toHaveBeenCalledWith(['select']);
		});
	});
});
