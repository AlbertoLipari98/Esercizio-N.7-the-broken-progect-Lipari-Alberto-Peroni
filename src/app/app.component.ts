import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-shell">
      <header class="app-header">
        <h1>Lipari Bank</h1>
        <p>Servizi Assicurativi — Sottoscrizione Polizza</p>
      </header>
      <main>
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent {}
