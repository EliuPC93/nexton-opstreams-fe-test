import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FieldInputComponent } from './field-input.component';
import { FormControl, FormGroup } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProcurementService } from '../../../services';

describe('FieldInputComponent', () => {
	let component: FieldInputComponent;
	let fixture: ComponentFixture<FieldInputComponent>;
	let mockProcurementService: jasmine.SpyObj<ProcurementService>;

	beforeEach(async () => {
		mockProcurementService = jasmine.createSpyObj('ProcurementService', ['submitRequest']);

		await TestBed.configureTestingModule({
			declarations: [FieldInputComponent],
			providers: [
				{ provide: ProcurementService, useValue: mockProcurementService },
			]
		}).compileComponents();

		fixture = TestBed.createComponent(FieldInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('autoSubmitField', () => {
		it('sets SAVED after a successful auto-submit', fakeAsync(() => {
			component.sectionId = 'sec1';
			const expectedformGroup = new FormGroup({ 1: new FormControl('answer') });

			mockProcurementService.submitRequest.and.returnValue(of({ id: 1, value: 'answer', title: '' }));

			component.autoSubmitField(expectedformGroup, 1);

			// before timer triggers nothing happened
			expect(component.savingState.label).toBe('');

			// trigger the 1s timer that starts the submit
			tick(3000);

			expect(mockProcurementService.submitRequest).toHaveBeenCalledWith('sec1', '1', 'answer');
			// on successful completion the state should be SAVED
			expect(component.savingState).toEqual({ label: 'SAVED', isComplete: true });
		}));

		it('retries on error, sets RETRYING during backoff, and ends SAVED when eventually successful', fakeAsync(() => {
			component.sectionId = 'sec1';
			const expectedformGroup = new FormGroup({ 1: new FormControl('answer') });

			let call = 0;
			mockProcurementService.submitRequest.and.callFake(() => {
				call++;
				if (call < 3) {
					return throwError(() => new Error('network'));
				}
				return of({ id: 1, value: 'answer', title: '' });
			});

			// ensure retries are allowed (2 retries -> total 3 attempts)
			component.maxRetries = 2;

			component.autoSubmitField(expectedformGroup, 1);


			// initial delay before first attempt
			tick(3000);
			expect(mockProcurementService.submitRequest).toHaveBeenCalledTimes(1);

			expect(component.savingState.label).toBe('RETRYING');
			tick(3500);

			expect(mockProcurementService.submitRequest).toHaveBeenCalledTimes(2);
			tick(3500);

			// success sets SAVED
			expect(component.savingState.label).toBe('SAVED');
			expect(component.savingState.isComplete).toBeTrue();
		}));
	});
});
