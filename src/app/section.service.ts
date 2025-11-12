import { Injectable } from "@angular/core";
import { ReplaySubject ,  Observable } from "rxjs";
import { ProductRequest } from "./product-requests";

@Injectable()
export class SectionService {
	private messageSubject: ReplaySubject<CurrentSchema> = new ReplaySubject<CurrentSchema>(1);

	public setSection(schema: ProductRequest, index = 0): void {
		this.messageSubject.next({ schema, index });
	}

	public getSection$(): Observable<CurrentSchema> {
		return this.messageSubject.asObservable();
	}
}

export interface CurrentSchema {
	schema: ProductRequest;
	index: number;
}
