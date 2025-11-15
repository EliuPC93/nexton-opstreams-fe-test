import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldInputComponent } from './field-input.component';

describe('FieldInputComponent', () => {
  let component: FieldInputComponent;
  let fixture: ComponentFixture<FieldInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FieldInputComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FieldInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onFocusOut method', () => {
    it('should emit id when onFocusOut is called', (done) => {
      component.field.id = 123;
      component.focusOut.subscribe((value: number) => {
        expect(value).toBe(123);
        done();
      });
      component.onFocusOut();
    });
  });
});
