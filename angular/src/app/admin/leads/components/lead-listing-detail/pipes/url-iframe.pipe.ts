import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'urlIframe' })
export class UrlSafePipe implements PipeTransform {

    constructor(
        private sanitizer: DomSanitizer
    ) { }

    transform(value: any, url?: any): any {
        if (value && !url) {
            let embedUrl = value;
            
            if (embedUrl && embedUrl.includes('youtu.be'))
            {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = embedUrl.match(regExp);
                if (match && match[2].length === 11) {
                    const sepratedID = match[2];
                    embedUrl = '//www.youtube.com/embed/' + sepratedID;
                }
            } 
            
            return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        }
    }
}
