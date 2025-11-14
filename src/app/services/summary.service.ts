import { Injectable } from "@angular/core";
import { ReplaySubject ,  Observable } from "rxjs";
import { Answer } from "../product-requests";

@Injectable({providedIn: 'root'})
export class SummaryService {
	private summarySubject: ReplaySubject<Answer[]> = new ReplaySubject<Answer[]>(1);

	public setSummary(answers: Answer[]): void {
		this.summarySubject.next(answers);
	}

	public getSummary$(): Observable<Answer[]> {
		return this.summarySubject.asObservable();
	}
}
