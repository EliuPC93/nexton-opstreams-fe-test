import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionComponent } from './selection.component';
import { ProcurementService } from '../services';

fdescribe('SelectionComponent', () => {
	let component: SelectionComponent;
	let fixture: ComponentFixture<SelectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SelectionComponent]
		})
			.compileComponents();

		TestBed.overrideComponent(SelectionComponent, {
			set: { providers: [{ provide: ProcurementService, useValue: new ProcurementServiceMock() }] }
		});
		fixture = TestBed.createComponent(SelectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

class ProcurementServiceMock {
	public getSchemas() {
		return {
			subscribe: () => { }
		}
	}
}
