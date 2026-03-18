import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { TaxCodeService } from '../services/tax-code.service';
import { codiceFiscaleValidator } from '../validators/codice-fiscale.validator';
import { pinMatchValidator } from '../validators/pin-match.validator';

@Component({
  selector: 'app-policy-subscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './policy-subscription.component.html'
})
export class PolicySubscriptionComponent implements OnInit {
  currentStep = signal(1);
  policyForm!: FormGroup;

  beneficiariControls: FormGroup[] = [];

  constructor(
    private fb: FormBuilder,
    private taxCodeService: TaxCodeService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.beneficiariControls = [...this.beneficiariArray.controls] as FormGroup[];
  }

  // ------------------------------------------------------------------ //
  //  Form construction
  // ------------------------------------------------------------------ //

  private buildForm(): void {
    this.policyForm = this.fb.group(
      {
        nome: ['', [Validators.required, Validators.minLength(2)]],
        cognome: ['', [Validators.required, Validators.minLength(2)]],
        dataNascita: ['', [Validators.required, this.etaMinimaValidator(18)]],
        codiceFiscale: [
          '',
          [Validators.required, Validators.minLength(16), Validators.maxLength(16)],
          [codiceFiscaleValidator(this.taxCodeService)]
        ],
        beneficiari: this.fb.array([this.createBeneficiario()]),
        pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
        confermaPin: ['', [Validators.required]]
      },
      { validators: pinMatchValidator() }
    );
  }

  private etaMinimaValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const today = new Date();
      const birthDate = new Date(control.value as string);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= minAge ? null : { etaMinima: { required: minAge, actual: age } };
    };
  }

  // ------------------------------------------------------------------ //
  //  FormArray helpers
  // ------------------------------------------------------------------ //

  get beneficiariArray(): FormArray {
    return this.policyForm.get('beneficiari') as FormArray;
  }

  createBeneficiario(): FormGroup {
    return this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      cf: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      percentuale: [0, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  addBeneficiario(): void {
    this.beneficiariArray.push(this.createBeneficiario());
  }

  removeBeneficiario(index: number): void {
    if (this.beneficiariArray.length > 1) {
      this.beneficiariArray.removeAt(index);
    }
  }

  // ------------------------------------------------------------------ //
  //  Validation helpers
  // ------------------------------------------------------------------ //

  getTotalePercentuale(): number {
    return this.beneficiariArray.controls.reduce(
      (sum, ctrl) => sum + ((ctrl.get('percentuale')?.value as number) || 0),
      0
    );
  }

  isSomma100(): boolean {
    return this.getTotalePercentuale() === 100;
  }

  isStep1Valid(): boolean {
    const fields = ['nome', 'cognome', 'dataNascita', 'codiceFiscale'];
    return fields.every(f => this.policyForm.get(f)?.valid);
  }

  isStep1Pending(): boolean {
    return this.policyForm.get('codiceFiscale')?.status === 'PENDING';
  }

  isStep2Valid(): boolean {
    return this.beneficiariArray.valid && this.isSomma100();
  }

  // ------------------------------------------------------------------ //
  //  Wizard navigation
  // ------------------------------------------------------------------ //

  nextStep(): void {
    if (this.currentStep() === 1 && this.isStep1Valid()) {
      this.currentStep.set(2);
    } else if (this.currentStep() === 2 && this.isStep2Valid()) {
      this.currentStep.set(3);
    }
  
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  // ------------------------------------------------------------------ //
  //  Final submission
  // ------------------------------------------------------------------ //

  onSubmit(): void {
    if (this.policyForm.valid) {
      alert('Polizza sottoscritta con successo! Benvenuto in Lipari Bank.');
    }
  }
}
