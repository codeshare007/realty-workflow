import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HttpService {

    constructor(
        private _http: HttpClient,
    ) { }

    public post(url: string, data: any = null): Observable<any> {
        return this._http.post(url, data);
    }
}
