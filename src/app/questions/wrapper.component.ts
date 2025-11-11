import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProductRequest } from '../product-requests';
import { SectionService } from '../section.service';

@Component({
	selector: 'app-wrapper',
	templateUrl: './wrapper.component.html',
	styleUrl: './wrapper.component.scss',
	standalone: false,
})
export class WrapperComponent {
	schema: ProductRequest | undefined;
	pageIndex: number = 0;

	constructor(private router: Router, private sectionService: SectionService) {
		const navigation = this.router.getCurrentNavigation();
		this.schema = navigation?.extras.state?.['schema'];
		this.goToPage(this.pageIndex);
	}

	goToPage(page: number) {
		this.pageIndex = page;
		this.router.navigate([this.pageIndex + 1], { relativeTo: this.router.routerState.root.firstChild });
		this.sectionService.setSection(this.schema!.sections[this.pageIndex]);
	}
}
