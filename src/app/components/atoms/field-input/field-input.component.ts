import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from '../../../product-requests';

@Component({
    selector: 'app-field-input',
    standalone: false,
    templateUrl: './field-input.component.html',
    styleUrls: ['./field-input.component.scss']
})
export class FieldInputComponent {
    @Input() field: Field | undefined;
    @Input() formGroup: FormGroup | undefined;
}
