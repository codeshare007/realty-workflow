import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MacKeysService {

    macKeys = {
        cmdKey: false,
        ctrlKey: false,
    };
}
