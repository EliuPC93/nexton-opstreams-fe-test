import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Answer } from '../product-requests';

@Component({
	selector: 'app-summary',
	templateUrl: './summary.component.html',
	styleUrl: './summary.component.scss'
})
export class SummaryComponent {
	public answers: Answer[] = [];

	constructor(private router: Router) {
		this.answers = this.router.currentNavigation()?.extras.state?.['answers'];
	 }
}
