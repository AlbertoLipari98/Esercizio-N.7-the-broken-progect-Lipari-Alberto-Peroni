import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, timer, switchMap, map, catchError, of } from 'rxjs';
import { TaxCodeService } from '../services/tax-code.service';

/**
 * Async validator with 500ms debounce.
 * Calls TaxCodeService.verifyCodiceFiscale() and maps the result
 * to a ValidationErrors object or null.
 */
export function codiceFiscaleValidator(taxCodeService: TaxCodeService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 16) {
      return of(null);
    }

    return timer(500).pipe(
      switchMap(() => taxCodeService.verifyCodiceFiscale(control.value as string)),
      map(result =>
        result.isValid
          ? null
          : { codiceFiscaleInvalid: { message: result.message } }
      ),
      catchError(() => of({ codiceFiscaleError: true }))
    );
  };
}
