import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Answer } from '../product-requests';
import { AtomsModule } from '../components/atoms/atoms.module';
import { AnswersService } from '../services';

@Component({
	selector: 'app-summary',
	imports: [AtomsModule],
	templateUrl: './summary.component.html',
	styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {
	public answers: Answer[] = [];

	constructor(private router: Router, private summarService: AnswersService) { }
	
	ngOnInit(): void {
		this.answers = this.summarService.getAnswers();

		if (!this.answers.length) this.restartFlow();
	}

	resetSummary() {
		this.summarService.setAnswers([]);
		this.restartFlow();
	}

	isValidAnswer(value: unknown) {
		return !!value || typeof value === "boolean"; 
	}
	
	restartFlow() {
		this.router.navigate(["select"]);
	}
}
