import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Cross-field validator applied at FormGroup level.
 * Checks that the 'pin' and 'confermaPin' controls have the same value.
 * The error { pinMismatch: true } is set on the FormGroup, NOT on the FormControl.
 */
export function pinMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const pin = group.get('pin')?.value as string;
    const confermaPin = group.get('confermaPin')?.value as string;

    if (!pin || !confermaPin) {
      return null;
    }

    return pin !== confermaPin ? { pinMismatch: true } : null;
  };
}
