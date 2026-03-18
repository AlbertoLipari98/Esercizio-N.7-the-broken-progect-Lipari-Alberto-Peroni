import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'insurance/subscribe',
    pathMatch: 'full'
  },
  {
    path: 'insurance/subscribe',
    loadComponent: () =>
      import('./features/insurance/policy-subscription/policy-subscription.component')
        .then(m => m.PolicySubscriptionComponent)
  }
];
