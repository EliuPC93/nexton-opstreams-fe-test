import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Field } from '../../../product-requests';

@Component({
    selector: 'app-field-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './field-input.component.html',
    styleUrls: ['./field-input.component.scss']
})
export class FieldInputComponent {
    @Input() field: Field | undefined;
    @Input() formGroup: FormGroup | undefined;
}
