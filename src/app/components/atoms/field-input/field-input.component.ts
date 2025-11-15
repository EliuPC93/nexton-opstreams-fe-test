import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from '../../../product-requests';

@Component({
    selector: 'app-field-input',
    standalone: false,
    templateUrl: './field-input.component.html',
    styleUrls: ['./field-input.component.scss']
})
export class FieldInputComponent {
    @Input() field: Field = { type: "text", id: 0, label: '', required: false };
    @Input() formGroup: FormGroup | undefined;
	@Output() focusOut = new EventEmitter<number>();
    
    public onFocusOut() {
        this.focusOut.emit(this.field.id);
    }
}
