import { Injectable } from '@angular/core';
import { EditionSelectDto } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class EditionHelperService {

  constructor() { }

  isEditionFree(edition: EditionSelectDto): boolean {
    return !edition.dailyPrice && !edition.weeklyPrice && !edition.monthlyPrice && !edition.annualPrice;
  }
}
