import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { RouteGuardService } from './route-guard.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { DataService } from './data.service';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withViewTransitions()),
		RouteGuardService,
		provideHttpClient(),
		importProvidersFrom(
			HttpClientInMemoryWebApiModule.forRoot(DataService, {
				delay: 500,
				passThruUnknownUrl: true
			})
		)
	]
};
