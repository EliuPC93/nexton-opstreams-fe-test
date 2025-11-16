import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperComponent } from './wrapper.component';
import { SchemaService } from '../services';
import { RouterOutlet, Router } from '@angular/router';
import { ProductRequest } from '../product-requests';
import { Subject } from 'rxjs';

describe('WrapperComponent', () => {
	let component: WrapperComponent;
	let fixture: ComponentFixture<WrapperComponent>;
	let mockSchemaService: jasmine.SpyObj<SchemaService>;
	let mockRouter: jasmine.SpyObj<Router>;
	const mockSchema: ProductRequest = { id: 'software-request', title: 'Software Request', sections: [] };
	let schemaSubject: Subject<{ schema: ProductRequest; index: number }>;

	beforeEach(async () => {
		schemaSubject = new Subject<{ schema: ProductRequest; index: number }>();
		mockSchemaService = jasmine.createSpyObj('SchemaService', ['setSchema', 'getSchema$']);
		mockSchemaService.getSchema$.and.returnValue(schemaSubject.asObservable());

		mockRouter = jasmine.createSpyObj('Router', ['navigate']);
		(mockRouter as any).currentNavigation = jasmine
			.createSpy('currentNavigation')
			.and.returnValue({ extras: { state: { schema: mockSchema } } } as any);

		await TestBed.configureTestingModule({
			imports: [RouterOutlet],
			declarations: [WrapperComponent],
			providers: [
				{ provide: SchemaService, useValue: mockSchemaService },
				{ provide: Router, useValue: mockRouter }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(WrapperComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Constructor', () => {
		it('should extract schema from router navigation state', () => {
			expect(component.schema).toEqual(mockSchema);
		});

		it('should initialize pageIndex to 0', () => {
			expect(component.pageIndex()).toBe(0);
		});

		it('should call setSchema on SchemaService with schema and pageIndex', () => {
			expect(mockSchemaService.setSchema).toHaveBeenCalledWith(mockSchema, 0);
		});

		it('should handle missing schema in navigation state', () => {
			(mockRouter as any).currentNavigation = jasmine
				.createSpy('currentNavigation')
				.and.returnValue({ extras: { state: {} } } as any);
			const newFixture = TestBed.createComponent(WrapperComponent);
			const newComponent = newFixture.componentInstance;
			expect(newComponent.schema).toBeUndefined();
		});
	});

	describe('ngOnInit', () => {
		it('should subscribe to SchemaService getSchema$ on init', () => {
			component.ngOnInit();
			expect(mockSchemaService.getSchema$).toHaveBeenCalled();
		});

		it('should update pageIndex when schema service emits', () => {
			component.ngOnInit();
			// start with constructor default
			expect(component.pageIndex()).toBe(0);

			schemaSubject.next({ schema: mockSchema, index: 2 });
			expect(component.pageIndex()).toBe(2);

			schemaSubject.next({ schema: mockSchema, index: 5 });
			expect(component.pageIndex()).toBe(5);
		});
	});
});
