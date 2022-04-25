import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { FileDto } from '@shared/service-proxies/service-proxies';

@Injectable()
export class FileDownloadService {

    downloadTempFile(file: FileDto) {
        const url = AppConsts.remoteServiceBaseUrl + '/SystemFile/DownloadTempFile?fileType=' + encodeURIComponent(file.fileType) + '&fileToken=' + encodeURIComponent(file.fileToken) + '&fileName=' + encodeURIComponent(file.fileName.replace(' ', '_'));
        location.href = url; //TODO: This causes reloading of same page in Firefox
    }
}
