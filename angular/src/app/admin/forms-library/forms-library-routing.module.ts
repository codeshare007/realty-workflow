import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormLibraryDocumentComponent } from './form-library-document/form-library-document.component';
import { FormsLibraryComponent } from './forms-library/forms-library.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: FormsLibraryComponent },
        {
            path: ':libraryFormId/edit-document',
            component: FormLibraryDocumentComponent,
            data: { permission: '' },
        },
        {
            // path: ':formLibrary/document',
            // loadChildren: () => {
            //     return import('app/admin/ ... .module')
            //         .then(m => m.FormLibraryModule);
            // },
            // data: { permission: '', preload: true }
        },
    ])],
    exports: [RouterModule]
})
export class FormsLibraryRoutingModule { }
