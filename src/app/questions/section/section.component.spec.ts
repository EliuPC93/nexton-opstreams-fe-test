import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SectionComponent } from './section.component';
import { ProcurementService, SchemaService, AnswersService } from '../../services';
import { FormGroup, FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Section, Field } from '../../product-requests';
import { Router } from '@angular/router';

describe('SectionComponent', () => {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;
  let mockProcurementService: jasmine.SpyObj<ProcurementService>;
  let mockAnswersService: jasmine.SpyObj<AnswersService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockProcurementService = jasmine.createSpyObj('ProcurementService', ['submitRequest']);
    mockAnswersService = jasmine.createSpyObj('AnswersService', ['setAnswers']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    // Mock routerState with proper structure for goToPage navigation
    (mockRouter as any).routerState = {
      root: {
        firstChild: {}
      }
    };

    await TestBed.configureTestingModule({
      providers: [
        SchemaService,
        { provide: ProcurementService, useValue: mockProcurementService },
        { provide: AnswersService, useValue: mockAnswersService },
        { provide: Router, useValue: mockRouter }
      ],
      declarations: [SectionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buildSectionFormGroup', () => {
    it('creates controls for fields and applies defaults/validators', () => {
      const section: Section = {
        id: 'sec1',
        title: 'Section 1',
        fields: [
          { id: 1, label: 'Question 1', type: 'text', required: true } as Field,
          { id: 2, label: 'Toggle 1', type: 'toggle', default: true } as Field
        ]
      };

      const group = component.buildSectionFormGroup(section);

      expect(group.controls[1]).toBeDefined();
      expect(group.controls[2]).toBeDefined();
      // toggle default applied
      expect(group.controls[2].value).toBe(true);
      // required validator should make q1 invalid when empty
      expect(group.controls[1].valid).toBeFalse();
      group.controls[1].setValue('answer');
      expect(group.controls[1].valid).toBeTrue();
    });
  });

  describe('getOrBuildSectionsFormGroup', () => {
    it('returns a cached FormGroup if already built', () => {
      const sections: Section[] = [
        { id: 'sec1', title: 'S1', fields: [] }
      ];

      const first = component.getOrBuildSectionsFormGroup(sections);
      const second = component.getOrBuildSectionsFormGroup(sections);

      expect(first).toBe(second);
      expect(component['sectionsFormGroup']).toBeDefined();
    });
  });

  describe('getQuestionTitle', () => {
    it('finds the label for a question id', () => {
      component.currentSchema = {
        id: 'req1',
        title: 'Req 1',
        sections: [
          { id: 'sec1', title: 'S1', fields: [{ id: 1, label: 'Label 1', type: 'text' } as Field] }
        ]
      } as any;

      const title = component.getQuestionTitle(1);
      expect(title).toBe('Label 1');
    });

    it('returns empty string when schema is missing or id not found', () => {
      component.currentSchema = undefined;
      expect(component.getQuestionTitle('nope')).toBe('');

      component.currentSchema = { id: 'x', title: 'x', sections: [] } as any;
      expect(component.getQuestionTitle('nope')).toBe('');
    });
  });

  describe('onSubmit integration', () => {
    it('builds requests and forwards answers to the summary service', fakeAsync(() => {
      // prepare a currentSchema so getQuestionTitle works
      component.currentSchema = {
        id: 'req1',
        title: 'Req 1',
        sections: [
          { id: 'sec1', title: 'S1', fields: [{ id: 1, label: 'Question 1', type: 'text' } as Field] }
        ]
      } as any;

      // create a nested FormGroup matching what the component expects
      component.sectionsFormGroup = new FormGroup({
        sec1: new FormGroup({ 1: new FormControl('answer') })
      });

      // mock submitRequest to return an observable of unmapped answer
      mockProcurementService.submitRequest.and.callFake((sectionId: any, questionId: any, answer: any) => {
        return of({ id: questionId, value: answer, title: '' });
      });

      component.onSubmit();
      // allow forkJoin + sync emissions to flush
      tick(0);

      expect(mockProcurementService.submitRequest).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['summary']);
      expect(mockAnswersService.setAnswers).toHaveBeenCalled();
    }));
  });

  describe('autoSubmitField', () => {
    it('sets SAVED after a successful auto-submit', fakeAsync(() => {
      component.currentSection = { id: 'sec1', title: 'S1', fields: [] } as any;
      component.currentFormGroup = new FormGroup({ 1: new FormControl('answer') });

      mockProcurementService.submitRequest.and.returnValue(of({ id: 1, value: 'answer', title: '' }));

      component.autoSubmitField(1);

      // before timer triggers nothing happened
      expect(component.savingState.label).toBe('');

      // trigger the 1s timer that starts the submit
      tick(1000);

      expect(mockProcurementService.submitRequest).toHaveBeenCalledWith('sec1', '1', 'answer');
      // on successful completion the state should be SAVED
      expect(component.savingState).toEqual({ label: 'SAVED', isComplete: true });
    }));

    it('retries on error, sets RETRYING during backoff, and ends SAVED when eventually successful', fakeAsync(() => {
      component.currentSection = { id: 'sec1', title: 'S1', fields: [] } as any;
      component.currentFormGroup = new FormGroup({ 1: new FormControl('answer') });

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

      component.autoSubmitField(1);

      // initial delay before first attempt
      tick(1000);
      expect(mockProcurementService.submitRequest).toHaveBeenCalledTimes(1);

     expect(component.savingState.label).toBe('RETRYING');
      tick(1500);

      expect(mockProcurementService.submitRequest).toHaveBeenCalledTimes(2);
      tick(1500);

      // success sets SAVED
      expect(component.savingState.label).toBe('SAVED');
      expect(component.savingState.isComplete).toBeTrue();
    }));
  });

  describe('goToPage method', () => {
    beforeEach(() => {
      component.currentSchema = {
        id: 'req1',
        title: 'Req 1',
        sections: [
          { id: 'sec1', title: 'S1', fields: [] },
          { id: 'sec2', title: 'S2', fields: [] },
          { id: 'sec3', title: 'S3', fields: [] }
        ]
      } as any;
      component.sectionIndex = 0;
    });

    it('navigates to specified page and calls setSchema', () => {
      const schemaService = TestBed.inject(SchemaService);
      spyOn(schemaService, 'setSchema');

      component.goToPage(2);

      expect(mockRouter.navigate).toHaveBeenCalledWith([3], jasmine.any(Object));
      expect(schemaService.setSchema).toHaveBeenCalledWith(component.currentSchema!, 2);
    });

    it('uses sectionIndex as default page when no argument provided', () => {
      const schemaService = TestBed.inject(SchemaService);
      spyOn(schemaService, 'setSchema');
      component.sectionIndex = 1;

      component.goToPage();

      expect(mockRouter.navigate).toHaveBeenCalledWith([2], jasmine.any(Object));
      expect(schemaService.setSchema).toHaveBeenCalledWith(component.currentSchema!, 1);
    });

    it('returns early if currentSchema is undefined', () => {
      const schemaService = TestBed.inject(SchemaService);
      spyOn(schemaService, 'setSchema');
      component.currentSchema = undefined;

      component.goToPage(1);

      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(schemaService.setSchema).not.toHaveBeenCalled();
    });

    it('navigates with correct relative path', () => {
      const schemaService = TestBed.inject(SchemaService);
      spyOn(schemaService, 'setSchema');

      component.goToPage(0);

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[0]).toEqual([1]);
      expect(callArgs[1]).toBeDefined();
    });
  });
});
