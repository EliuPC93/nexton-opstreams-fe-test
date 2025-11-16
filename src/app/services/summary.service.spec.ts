import { TestBed } from '@angular/core/testing';
import { AnswersService } from './summary.service';

describe('AnswersService', () => {
	let service: AnswersService;

	beforeEach(() => {
		TestBed.configureTestingModule({ providers: [AnswersService] });
		service = TestBed.inject(AnswersService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('returns empty answers by default', () => {
		expect(service.getAnswers()).toEqual([]);
	});

	it('setAnswers stores and getAnswers returns the provided array', () => {
		const answers = [{ id: 1, value: 'x', title: 'T' } as any];
		service.setAnswers(answers);
		// current implementation returns the same array reference
		expect(service.getAnswers()).toBe(answers);
		expect(service.getAnswers()).toEqual(answers);
	});

	it('overwrites previously set answers', () => {
		service.setAnswers([{ id: 2, value: 'a', title: 'A' } as any]);
		expect(service.getAnswers()).toEqual([{ id: 2, value: 'a', title: 'A' } as any]);

		service.setAnswers([]);
		expect(service.getAnswers()).toEqual([]);
	});
});

