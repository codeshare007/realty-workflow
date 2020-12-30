import { Attribute, Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

//Got from: https://scotch.io/tutorials/how-to-implement-a-custom-validator-directive-confirm-password-in-angular-2

@Directive({
    selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator), multi: true }
    ]
})
export class EqualValidator implements Validator {
    constructor(
        @Attribute('validateEqual') public validateEqual: string,
        @Attribute('reverse') public reverse: string
    ) {
    }

    private get isReverse() {
        if (!this.reverse) {
            return false;
        }

        return this.reverse === 'true';
    }

    validate(control: AbstractControl): { [key: string]: any } {
        const pairControl = control.root.get(this.validateEqual);
        if (!pairControl) {
            return null;
        }

        const value = control.value;
        const pairValue = pairControl.value;

        if (!value && !pairValue) {
            this.deleteErrors(pairControl);
            return null;
        }

        if (this.isReverse) {
            if (value === pairValue) {
                this.deleteErrors(pairControl);
            } else {
                pairControl.setErrors({
                    validateEqual: true
                });
            }

            return null;
        } else {
            if (value !== pairValue) {
                return {
                    validateEqual: true
                };
            }
        }
    }

    deleteErrors(control: AbstractControl) {
        if (control.errors) {
            delete control.errors['validateEqual'];
        }

        if (control.errors && !Object.keys(control.errors).length) {
            control.setErrors(null);
        }
    }
}
