import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";

@Component({
    templateUrl: './contacts-page.component.html',
    encapsulation: ViewEncapsulation.None,
    // styleUrls: ['./customers-page.component.less'],
    animations: [appModuleAnimation()]
})
export class ContactsPageComponent extends AppComponentBase implements OnInit {
    ngOnInit(): void {
    }
    
}