import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProductRequest } from '../product-requests';

@Component({
	selector: 'app-wrapper',
	templateUrl: './wrapper.component.html',
	styleUrl: './wrapper.component.scss',
 imports: [RouterOutlet]
})
export class WrapperComponent {
	schema: ProductRequest | undefined;
	page = 1;

	constructor(private router: Router) {
		const navigation = this.router.getCurrentNavigation();
		this.schema = navigation?.extras.state?.['schema'];
		this.router.navigate([this.page], { relativeTo: this.router.routerState.root.firstChild, state: {section: this.schema?.sections[this.page - 1]} });
	}

}
