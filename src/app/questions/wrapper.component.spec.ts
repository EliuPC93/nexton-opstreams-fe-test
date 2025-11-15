import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperComponent } from './wrapper.component';
import { SchemaService } from '../services';
import { RouterOutlet } from '@angular/router';

describe('WrapperComponent', () => {
	let component: WrapperComponent;
	let fixture: ComponentFixture<WrapperComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterOutlet],
			declarations: [WrapperComponent],
			providers: [SchemaService]
		})
			.compileComponents();

		fixture = TestBed.createComponent(WrapperComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
