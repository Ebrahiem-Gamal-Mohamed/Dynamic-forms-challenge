import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseControl } from './control-types/base-control.model';
import { FormDataControlService } from './_services/form-data-control.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Dynamic-forms-challenge';
  textControl: FormControl;
  formDataControls$: Observable<BaseControl<any>[]>;

  constructor(private fdc: FormDataControlService) {
    this.textControl = new FormControl('');
  }

  ngOnInit(): void {
    this.formDataControls$ = this.textControl.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((res: string) => {
          return this.fdc.getFormData(res);
        }),
        tap(data => console.log(data))
      );
  }

  onCancleClicked(value: boolean) {
    if (value) {
      this.textControl.reset();
    }
  }
}
