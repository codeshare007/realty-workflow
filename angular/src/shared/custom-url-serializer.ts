import { UrlSerializer, UrlTree, DefaultUrlSerializer } from '@angular/router';

export class CustomUrlSerializer implements UrlSerializer {
  parse(url: any): UrlTree {
    const dus = new DefaultUrlSerializer();
    return dus.parse(unescape(url));
  }

  serialize(tree: UrlTree): any {
    const dus = new DefaultUrlSerializer();
    return dus.serialize(tree);
  }
}