import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss'
})
export class SectionComponent {
	constructor(private router: Router) {
		const navigation = this.router.getCurrentNavigation();
		console.log(navigation?.extras.state?.['section']);
	}
}
