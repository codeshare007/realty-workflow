import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { TokenService } from 'abp-ng2-module';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionFormReportService {
  downloadingFile = false;
  private _unsubscibeSubject: Subject<any> = new Subject();
  private _lastUrl: string;

  constructor(private _httpClient: HttpClient,
    private _tokenService: TokenService) {
  }

  downloadReport(id: string, formId: string, filename: string, callback: () => void) {
    this.downloadingFile = true;
    this.loadReport$(id, formId)
      .pipe(
        this.ngUnsubscribe(),
        tap(() => this.downloadingFile = false),
        map(response => this.getBlobUrl(response))
      ).subscribe(url => {
        this.downloadFile(url, filename);

        if (callback !== undefined) {
          callback();
        }
      });
  }

  // Used to unsubscribe from events on component destroy
  // Example usage:
  // service.getThings().pipe(this.ngUnsubscribe()).subscribe(result => doSomething());
  // More details: https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
  protected ngUnsubscribe<T>() {
    return takeUntil<T>(this._unsubscibeSubject);
  }

  private completeNgUnsubscribe(): void {
    this._unsubscibeSubject.next();
    this._unsubscibeSubject.complete();
  }

  private disposeOldUrl() {
    if (this._lastUrl) {
      window.URL.revokeObjectURL(this._lastUrl);
    }
  }

  dispose() {
    this.disposeOldUrl();
    this.completeNgUnsubscribe();
  }

  private loadReport$(id: string, formId: string): Observable<Blob> {
    const url = '/Printsigning/PrintTransactionForm?id=' + id + '&formId=' + formId;

    const headers = new HttpHeaders().set('Authorization', this.getAuthorizationHeader())
      .set('Access-Control-Allow-Origin', 'http://localhost:4300');

    return this._httpClient
      .get(AppConsts.remoteServiceBaseUrl + url, { headers, responseType: 'blob', withCredentials: true });
  }

  private getBlobUrl(data: Blob): string {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    this.disposeOldUrl();
    this._lastUrl = url;

    return url;
  }

  private downloadFile(url, filename) {
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename.replace(/[^a-zA-Z0-9 ]/g, "").replace(/[ ]/g, '_'));

    const event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(event);
  }

  private getAuthorizationHeader(): string {
    return 'Bearer ' + this._tokenService.getToken();
  }
}