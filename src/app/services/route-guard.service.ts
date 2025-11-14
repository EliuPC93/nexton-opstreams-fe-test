import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

@Injectable()
export class RouteGuardService implements CanActivate {
	constructor(public router: Router) {}
	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // if there is no state then redirect to select page
        if (!this.router.currentNavigation()?.extras.state) {
            this.router.navigate(['select']);
            return false;
        }
		return true;
	}
}
