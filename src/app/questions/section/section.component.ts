import { Component, OnInit } from '@angular/core';
import { SectionService } from '../../section.service';
import { Section } from '../../product-requests';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss'
})
export class SectionComponent implements OnInit {
	currentSection: Section | null = null;
	constructor(private sectionService: SectionService) {
	}

	ngOnInit(): void {
		this.sectionService.getSection$().subscribe(section => {
			console.log('Received section via service:', section);
			this.currentSection = section;
		});
	}
}
