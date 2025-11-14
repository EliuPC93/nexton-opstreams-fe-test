import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
export interface Answer { id: number, asnwer: unknown };

@Injectable()
export class AnswerService {
    private answersSubject: ReplaySubject<Answer[]> = new ReplaySubject<Answer[]>(1);
    
    public setAnswers(answers: Answer[]): void {
        this.answersSubject.next(answers);
    }

    public getAnswers$(): Observable<Answer[]> {
        return this.answersSubject.asObservable();
    }
}
