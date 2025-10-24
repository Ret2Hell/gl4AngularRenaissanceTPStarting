import { AuthInterceptorProvider } from './app/auth/interceptors/auth.interceptor';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    AuthInterceptorProvider,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideToastr(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
}).catch((err) => console.error(err));
