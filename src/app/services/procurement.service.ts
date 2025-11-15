import { Injectable } from "@angular/core";
import { ProductRequest } from "../product-requests";
import { delay, mergeMap, Observable, of, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ProcurementService {

    constructor(private httpClient: HttpClient) { }

    private maybeFail<T>(successValue: T): Observable<T> {
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

    public submitRequest(requestId: string, questionId: string, value: unknown): Observable<any> {
        return this.httpClient.put<any>(`api/requests/${requestId}/question/${questionId}`, { value }).pipe(
            delay(600),
            mergeMap(this.maybeFail)
        );;
    };
}
