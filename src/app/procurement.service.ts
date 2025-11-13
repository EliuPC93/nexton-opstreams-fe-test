import { Injectable } from "@angular/core";
import { ProductRequest } from "./product-requests";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ProcurementService {

    constructor(private httpClient: HttpClient) { }

    public getSchemas(): Observable<ProductRequest[]> {
        return this.httpClient.get<ProductRequest[]>('api/schemas');
    }
}
