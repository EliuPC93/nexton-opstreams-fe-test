import { Injectable } from "@angular/core";
import { Answer, ProductRequest } from "../product-requests";
import { delay, mergeMap, Observable, of, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ProcurementService {

    constructor(private httpClient: HttpClient) { }

    private maybeFail<Answer>(successValue: Answer): Observable<Answer> {
        // 20% chance of failure
        const shouldFail = Math.random() < 0.2; 

        if (shouldFail) {
            return throwError(() => new Error("Random simulated error"));
        }

        return of(successValue);
    }

    public getSchemas(): Observable<ProductRequest[]> {
        return this.httpClient.get<ProductRequest[]>('api/schemas');
    }

    public submitRequest(requestId: string, questionId: string, value: unknown): Observable<Answer> {
        return this.httpClient.put<Answer>(`api/requests/${requestId}/question/${questionId}`, { value }).pipe(
            delay(600),
            mergeMap(this.maybeFail)
        );
    };
}
