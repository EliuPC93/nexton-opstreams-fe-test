import { Injectable } from "@angular/core";
import { ReplaySubject ,  Observable } from "rxjs";
import { Answer } from "../product-requests";

@Injectable({providedIn: 'root'})
export class AnswersService {
	private answers: Answer[] = [];

	public setAnswers(answers: Answer[]): void {
		this.answers = answers;
	}

	public getAnswers(): Answer[] {
		return this.answers;
	}
}
