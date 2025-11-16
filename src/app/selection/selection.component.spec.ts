import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionComponent } from './selection.component';
import { ProcurementService } from '../services';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductRequest } from '../product-requests';

describe('SelectionComponent', () => {
	let component: SelectionComponent;
	let fixture: ComponentFixture<SelectionComponent>;
	let mockProcurementService: jasmine.SpyObj<ProcurementService>;
	let mockRouter: jasmine.SpyObj<Router>;

	const mockSchemas: ProductRequest[] = [
		{
			id: 'software-request',
			title: 'Software Request',
			sections: []
		},
		{
			id: 'hardware-request',
			title: 'Hardware Request',
			sections: []
		}
	];

	beforeEach(async () => {
		mockProcurementService = jasmine.createSpyObj('ProcurementService', ['getSchemas']);
		mockProcurementService.getSchemas.and.returnValue(of(mockSchemas));

		mockRouter = jasmine.createSpyObj('Router', ['navigate']);

		await TestBed.configureTestingModule({
			imports: [SelectionComponent],
			providers: [
				{ provide: ProcurementService, useValue: mockProcurementService },
				{ provide: Router, useValue: mockRouter }
			]
		})
			.compileComponents();

		TestBed.overrideComponent(SelectionComponent, {
			set: { providers: [{ provide: ProcurementService, useValue: mockProcurementService }] }
		});
		fixture = TestBed.createComponent(SelectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should call getSchemas on ProcurementService', () => {
			expect(mockProcurementService.getSchemas).toHaveBeenCalled();
			expect(component.productSchemas).toEqual(mockSchemas);
			expect(component.selected).toBe('');
		});
	});

	describe('setSelection method', () => {
		it('should set the selected property to the provided value', () => {
			component.setSelection('software-request');
			expect(component.selected).toBe('software-request');
		});
	});

	describe('goToNext method', () => {
		it('should navigate to /questions route', () => {
			component.productSchemas = mockSchemas;
			component.selected = 'software-request';

			component.goToNext();

			expect(mockRouter.navigate).toHaveBeenCalledWith(
				['/questions'],
				jasmine.objectContaining({
					state: jasmine.objectContaining({
						schema: mockSchemas[0]
					})
				})
			);
			const callArgs = mockRouter.navigate.calls.mostRecent().args;
			expect((callArgs[1] as any).state.schema.id).toBe('software-request');
		});

		it('should pass undefined schema if selection does not match any schema', () => {
			component.productSchemas = mockSchemas;
			component.selected = 'non-existent';

			component.goToNext();

			expect(mockRouter.navigate).toHaveBeenCalledWith(
				['/questions'],
				jasmine.objectContaining({
					state: jasmine.objectContaining({
						schema: undefined
					})
				})
			);
		});
	});
});
