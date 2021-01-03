import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseControl } from '../control-types/base-control.model';

import { FormDataControlService } from '../_services/form-data-control.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() formDataControls: BaseControl<string>[] = [];
  @Output() onCancleClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  formData: FormGroup;
  payLoad = '';

  constructor(private fdc: FormDataControlService) {}

  ngOnChanges(data: SimpleChanges): void {
    this.payLoad = '';
    if (data['formDataControls'] && data['formDataControls'].currentValue) {
      this.formDataControls = data['formDataControls'].currentValue as any;
      this.formData = this.fdc.toFormGroup(this.formDataControls);
    }
  }

  ngOnInit() {
  }

  onSubmit() { // check form validation..
    if (this.formData && this.formData.valid) {
      this.payLoad = JSON.stringify(this.formData.getRawValue());
    }
  }

  resetForm() { // reset form, formControls and payload after cancelling
    this.formData.reset();
    this.formDataControls = [];
    this.payLoad = '';
    this.onCancleClicked.emit(true);
  }
}
