import { Injectable } from "@angular/core";
import { ProductRequest } from "../product-requests";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ProcurementService {

    constructor(private httpClient: HttpClient) { }

    public getSchemas(): Observable<ProductRequest[]> {
        return this.httpClient.get<ProductRequest[]>('api/schemas');
    }

    public submitRequest(requestId: string, questionId: string, answer: unknown): Observable<any> {
        return this.httpClient.put<any>(`api/requests/${requestId}/question/${questionId}`, { answer });
    };
}
