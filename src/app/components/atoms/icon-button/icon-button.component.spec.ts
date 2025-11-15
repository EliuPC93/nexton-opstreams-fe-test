import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconButtonComponent } from './icon-button.component';

describe('IconButtonComponent', () => {
  let component: IconButtonComponent;
  let fixture: ComponentFixture<IconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSelect method', () => {
    it('should emit key when onSelect is called', (done) => {
      component.key = 'test-icon';
      component.select.subscribe((value: string) => {
        expect(value).toBe('test-icon');
        done();
      });
      component.onSelect();
    });
  });

  describe('getClass method', () => {
    it('should extract class name from hyphenated string', () => {
      const result = component.getClass('icon-home');
      expect(result).toBe('icon');
    });

    it('should convert to lowercase before extraction', () => {
      const result = component.getClass('ICON-HOME');
      expect(result).toBe('icon');
    });

    it('should extract first part before first hyphen', () => {
      const result = component.getClass('icon-home-setting');
      expect(result).toBe('icon');
    });
  });

  describe('getLabel method', () => {
    it('should capitalize first letter and return class name', () => {
      const result = component.getLabel('icon-home');
      expect(result).toBe('Icon');
    });

    it('should handle uppercase input', () => {
      const result = component.getLabel('BUTTON-CLICK');
      expect(result).toBe('Button');
    });

    it('should work with different icon prefixes', () => {
      const result = component.getLabel('user-profile');
      expect(result).toBe('User');
    });
  });
});
