import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface TaxCodeVerifyResult {
  isValid: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class TaxCodeService {
  /**
   * Simulates a remote verification of a codice fiscale.
   * Returns after ~1 second delay.
   * Returns isValid: false for CF starting with 'X' (simulation of invalid code).
   */
  verifyCodiceFiscale(cf: string): Observable<TaxCodeVerifyResult> {
    const isValid = !cf.toUpperCase().startsWith('X');
    const result: TaxCodeVerifyResult = {
      isValid,
      message: isValid
        ? 'Codice fiscale verificato correttamente'
        : 'Codice fiscale non trovato in archivio (simulazione: CF che inizia con X)'
    };
    return of(result).pipe(delay(1000));
  }
}
