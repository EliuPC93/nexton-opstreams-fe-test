import { Injectable } from "@angular/core";
import { ReplaySubject ,  Observable } from "rxjs";
import { ProductRequest } from "../product-requests";

@Injectable()
export class SchemaService {
	private schemaSubject: ReplaySubject<CurrentSchema> = new ReplaySubject<CurrentSchema>(1);

	public setSchema(schema: ProductRequest, index = 0): void {
		this.schemaSubject.next({ schema, index });
	}

	public getSchema$(): Observable<CurrentSchema> {
		return this.schemaSubject.asObservable();
	}
}

export interface CurrentSchema {
	schema: ProductRequest;
	index: number;
}
