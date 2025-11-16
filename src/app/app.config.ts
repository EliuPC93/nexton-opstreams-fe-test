import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { DataService, RouteGuardService } from './services';
import { provideHttpClient } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withViewTransitions()),
		RouteGuardService,
		provideHttpClient(),
		importProvidersFrom(
			HttpClientInMemoryWebApiModule.forRoot(DataService, {
				delay: 700,
				passThruUnknownUrl: true
			})
		)
	]
};
