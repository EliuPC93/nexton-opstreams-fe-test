import { Injectable } from "@angular/core";
import { ReplaySubject ,  Observable } from "rxjs";
import { Section } from "./product-requests";

@Injectable()
export class SectionService {
	private messageSubject: ReplaySubject<Section> = new ReplaySubject<Section>(1);

	public setSection(section: Section): void {
		this.messageSubject.next(section);
	}

	public getSection$(): Observable<Section> {
		return this.messageSubject.asObservable();
	}
}
