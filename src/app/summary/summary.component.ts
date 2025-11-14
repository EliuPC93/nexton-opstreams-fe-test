import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Answer } from '../product-requests';
import { AtomsModule } from '../components/atoms/atoms.module';
import { SummaryService } from '../services';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'app-summary',
	imports: [AtomsModule, AsyncPipe],
	templateUrl: './summary.component.html',
	styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {
	public answers$: Observable<Answer[]> = of([]);

	constructor(private router: Router, private summarService: SummaryService) { }
	
	ngOnInit(): void {
		this.answers$ = this.summarService.getSummary$()
	}

	resetFlow() {
		this.summarService.setSummary([]);
		this.router.navigate(["select"]);
	}
}
