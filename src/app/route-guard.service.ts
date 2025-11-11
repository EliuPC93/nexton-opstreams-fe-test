import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

@Injectable()
export class RouteGuardService implements CanActivate {
	constructor(public router: Router) {}
	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // if there is no schema selected then redirect to select page
        if (!this.router.getCurrentNavigation()?.extras.state?.['schema']) {
            this.router.navigate(['select']);
            return false;
        }
		return true;
	}
}
