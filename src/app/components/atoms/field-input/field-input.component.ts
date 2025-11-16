import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from '../../../product-requests';
import { isValidAnswer } from '../../../shared/utils';
import { concatMap, filter, retry, tap, timer } from 'rxjs';
import { ProcurementService } from '../../../services';

@Component({
    selector: 'app-field-input',
    standalone: false,
    templateUrl: './field-input.component.html',
    styleUrls: ['./field-input.component.scss']
})
export class FieldInputComponent {
    @Input() field: Field = { type: "text", id: 0, label: '', required: false };
    @Input() formGroup: FormGroup | undefined;
    @Input() sectionId = '';
	savingState = { label: '', isComplete: false };
    maxRetries = 2;

    constructor(private procurementService: ProcurementService) { }

    public autoSubmitField(currentFormGroup: FormGroup, fieldId: number) {
        const answer = currentFormGroup.value[fieldId];

        timer(3000)
            .pipe(
                filter(() => isValidAnswer(answer)),
                tap(() => this.savingState = { label: "SAVING", isComplete: false }),
                concatMap(() => this.procurementService.submitRequest(this.sectionId, fieldId.toString(), answer)),
                retry({
                    count: this.maxRetries,
                    delay: () => {
                        this.savingState = { label: "RETRYING", isComplete: false };
                        return timer(500)
                    }
                }))
            .subscribe({
                complete: () => this.savingState = { label: 'SAVED', isComplete: true },
                error: (err) => {
                    console.error(err);
                    this.savingState = { label: 'ERROR', isComplete: true }
                }
            }
        );
    }
}
