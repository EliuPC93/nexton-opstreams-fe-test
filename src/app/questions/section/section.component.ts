import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss'
})
export class SectionComponent implements OnChanges {
	constructor(private router: Router) {
		const navigation = this.router.getCurrentNavigation();
		console.log(navigation?.extras.state?.['section']);
	}

	ngOnChanges(changes: SimpleChanges): void {
		const navigation = this.router.getCurrentNavigation();
		console.log(navigation?.extras.state?.['section']);
	}
}
