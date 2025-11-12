import { Component, OnInit } from '@angular/core';
import { CurrentSchema, SectionService } from '../../section.service';
import { ActionButtonComponent } from '../../components/atoms/action-button/action-button.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-section',
	templateUrl: './section.component.html',
	styleUrl: './section.component.scss',
	imports: [ActionButtonComponent]
})
export class SectionComponent implements OnInit {
	currentSchema: CurrentSchema | undefined;
	sectionIndex: number = 0;
	isLastIndex: boolean = false;

	constructor(private router: Router, private sectionService: SectionService) {}

	ngOnInit(): void {
		this.sectionService.getSection$().subscribe(section => {
			console.log('Received schema via service:', section);
			this.currentSchema = section;
			this.sectionIndex = section.index;
			this.isLastIndex = section.index === section.schema.sections.length - 1;
		});
	}

	getSectionTitle(): string {
		return this.currentSchema ? this.currentSchema.schema.sections[this.currentSchema.index].title : '';
	}

	goToPage(pageToGo = this.sectionIndex) {
		if (!this.currentSchema) return;
		this.router.navigate([pageToGo + 1], { relativeTo: this.router.routerState.root.firstChild });
		this.sectionService.setSection(this.currentSchema.schema, pageToGo);
	}
}
