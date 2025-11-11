import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProductRequest } from '../product-requests';
import { SectionService } from '../section.service';

@Component({
	selector: 'app-wrapper',
	templateUrl: './wrapper.component.html',
	styleUrl: './wrapper.component.scss',
 imports: [RouterOutlet]
})
export class WrapperComponent {
	schema: ProductRequest | undefined;

	constructor(private router: Router, private sectionService: SectionService) {
		const navigation = this.router.getCurrentNavigation();
		this.schema = navigation?.extras.state?.['schema'];
		this.goToPage(0);
	}

	goToPage(page: number) {
		this.router.navigate([page + 1], { relativeTo: this.router.routerState.root.firstChild });
		this.sectionService.setSection(this.schema!.sections[page]);
	}
}
