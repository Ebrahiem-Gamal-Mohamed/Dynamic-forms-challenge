import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseControl } from '../control-types/base-control.model';

@Component({
  selector: 'app-dynamic-form-control',
  templateUrl: './dynamic-form-control.component.html',
  styleUrls: ['./dynamic-form-control.component.scss'],
})
export class DynamicFormControlComponent implements OnInit {
  @Input() formDataControl: BaseControl<string>;
  @Input() formData: FormGroup;

  constructor() {}

  ngOnInit(): void {}

  get isValid() {
    return this.formData && this.formData.controls[this.formDataControl.key] ? this.formData.controls[this.formDataControl.key].valid : true;
  }
}
