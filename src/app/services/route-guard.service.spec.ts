import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouteGuardService } from './route-guard.service';

describe('RouteGuardService', () => {
    let service: RouteGuardService;
    let mockRouter: jasmine.SpyObj<Router>;

    beforeEach(() => {
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        TestBed.configureTestingModule({
            providers: [
                RouteGuardService,
                { provide: Router, useValue: mockRouter }
            ]
        });

        service = TestBed.inject(RouteGuardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('canActivate', () => {
        let mockRoute: ActivatedRouteSnapshot;
        let mockState: RouterStateSnapshot;

        beforeEach(() => {
            mockRoute = {} as ActivatedRouteSnapshot;
            mockState = { url: '/questions' } as RouterStateSnapshot;
        });

        it('allows navigation when router.currentNavigation() has state', () => {
            (mockRouter as any).currentNavigation = jasmine.createSpy('currentNavigation').and.returnValue({
                extras: { state: { schema: { id: 'software-request' } } }
            });

            const result = service.canActivate(mockRoute, mockState);

            expect(result).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });

        it('redirects to select and returns false when no state', () => {
            (mockRouter as any).currentNavigation = jasmine.createSpy('currentNavigation').and.returnValue({
                extras: { state: null }
            });

            const result = service.canActivate(mockRoute, mockState);

            expect(result).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['select']);
        });

        it('redirects to select when currentNavigation is undefined', () => {
            (mockRouter as any).currentNavigation = jasmine.createSpy('currentNavigation').and.returnValue(undefined);

            const result = service.canActivate(mockRoute, mockState);

            expect(result).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['select']);
        });

        it('allows navigation for various state shapes', () => {
            (mockRouter as any).currentNavigation = jasmine.createSpy('currentNavigation').and.returnValue({
                extras: { state: { schema: {}, data: 'any' } }
            });

            const result = service.canActivate(mockRoute, mockState);

            expect(result).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
    });
});
