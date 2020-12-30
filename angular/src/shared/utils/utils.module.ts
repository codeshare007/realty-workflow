import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AutoFocusDirective } from './auto-focus.directive';
import { BusyIfDirective } from './busy-if.directive';
import { ButtonBusyDirective } from './button-busy.directive';
import { FileDownloadService } from './file-download.service';
import { FriendProfilePictureComponent } from './friend-profile-picture.component';
import { LocalStorageService } from './local-storage.service';
import { MomentFormatPipe } from './moment-format.pipe';
import { MomentFromNowPipe } from './moment-from-now.pipe';
import { ValidationMessagesComponent } from './validation-messages.component';
import { EqualValidator } from './validation/equal-validator.directive';
import { PasswordComplexityValidator } from './validation/password-complexity-validator.directive';
import { NullDefaultValueDirective } from './null-value.directive';
import { ScriptLoaderService } from './script-loader.service';
import { StyleLoaderService } from './style-loader.service';
import { ArrayToTreeConverterService } from './array-to-tree-converter.service';
import { TreeDataHelperService } from './tree-data-helper.service';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';
import { PermissionPipe } from '@shared/common/pipes/permission.pipe';
import { PermissionAnyPipe } from '@shared/common/pipes/permission-any.pipe';
import { PermissionAllPipe } from '@shared/common/pipes/permission-all.pipe';
import { FeatureCheckerPipe } from '@shared/common/pipes/feature-checker.pipe';
import { DatePickerMomentModifierDirective } from './date-picker-moment-modifier.directive';
import { DateRangePickerMomentModifierDirective } from './date-range-picker-moment-modifier.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        FileDownloadService,
        LocalStorageService,
        ScriptLoaderService,
        StyleLoaderService,
        ArrayToTreeConverterService,
        TreeDataHelperService
    ],
    declarations: [
        EqualValidator,
        PasswordComplexityValidator,
        ButtonBusyDirective,
        AutoFocusDirective,
        BusyIfDirective,
        FriendProfilePictureComponent,
        MomentFormatPipe,
        MomentFromNowPipe,
        ValidationMessagesComponent,
        NullDefaultValueDirective,
        LocalizePipe,
        PermissionPipe,
        PermissionAnyPipe,
        FeatureCheckerPipe,
        DatePickerMomentModifierDirective,
        DateRangePickerMomentModifierDirective,
        PermissionAllPipe
    ],
    exports: [
        EqualValidator,
        PasswordComplexityValidator,
        ButtonBusyDirective,
        AutoFocusDirective,
        BusyIfDirective,
        FriendProfilePictureComponent,
        MomentFormatPipe,
        MomentFromNowPipe,
        ValidationMessagesComponent,
        NullDefaultValueDirective,
        LocalizePipe,
        PermissionPipe,
        PermissionAnyPipe,
        FeatureCheckerPipe,
        DatePickerMomentModifierDirective,
        DateRangePickerMomentModifierDirective,
        PermissionAllPipe
    ]
})
export class UtilsModule { }
