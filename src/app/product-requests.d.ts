interface BaseField {
    id: number;
    label: string;
    required: boolean;
}

interface RadioField extends BaseField {
    type: "radio";
    options: string[];
}

interface TextField extends BaseField {
    type: "text";
}

interface NumberField extends BaseField {
    type: "number";
}

interface ToggleField extends Omit<BaseField, "required"> {
    type: "toggle",
    default: boolean;
}

type Field = TextField | NumberField | RadioField | ToggleField;

interface Section {
    id: string;
    title: string;
    fields: Field[];
}

interface BaseRequest {
    title: string;
    sections: Section[];
}

interface Software extends BaseRequest {
    id: "software-request";
}

interface Hardware extends BaseRequest {
    id: "hardware-request";
}

export type ProductRequest = Software | Hardware;
