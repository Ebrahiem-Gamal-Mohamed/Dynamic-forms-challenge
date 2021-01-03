import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { BaseControl } from '../control-types/base-control.model';
import { TextboxControl } from '../control-types/textbox-control.model';
import { DropDownControl } from '../control-types/dropdown-control.model';

@Injectable({
  providedIn: 'root',
})
export class FormDataControlService {
  constructor() {}

  toFormGroup(formData: BaseControl<string>[]) {
    const group: any = {};
    if (formData && formData.length) {
      formData.forEach((item) => {
        group[item.key] = item.required
          ? new FormControl(item.value || '', Validators.required)
          : new FormControl(item.value || '');
      });
    }
    return new FormGroup(group);
  }

  getFormData(data: string) {
    let formData: BaseControl<string>[] = [];
    if (data && data.trim() !== '') {
      try {
        const parsedData = JSON.parse(data);
        formData = this.buildFormStructure(parsedData);
      } catch (e) {
        console.log('Error happend when parsing json data : ', e);
      }
    }

    return of(formData);
  }

  private buildFormStructure(parsedData) {
    let formArr = [];
    for (let prop in parsedData) {
      if (
        parsedData[prop] &&
        !Array.isArray(parsedData[prop]) &&
        typeof parsedData[prop] === 'object' &&
        Object.keys(parsedData[prop]).length !== 0
      ) { // type of object ...
        for (let objProp in parsedData[prop]) {
          formArr.push(this.buildFormControls(objProp, parsedData[prop]));
        }
      } else { // other types ...
        formArr.push(this.buildFormControls(prop, parsedData));
      }
    }
    return formArr;
  }

  private buildFormControls(prop: string, parsedData: any) {
    let item;
    if (parsedData[prop] && Array.isArray(parsedData[prop])) { // dropdown list...
      item = new DropDownControl({
        key: prop,
        label: prop,
        options: this.buildListDataControl(parsedData[prop]),
        required: false,
      });
    } else if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        parsedData[prop]
      )
    ) {  // type="email"
      item = new TextboxControl({
        key: prop,
        label: prop,
        value: parsedData[prop],
        required: true,
        type: 'email',
      });
    } else if (
      String(parsedData[prop]).match(
        /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
      )
    ) { // type="date"
      item = new TextboxControl({
        key: prop,
        label: prop,
        value: new Date(parsedData[prop]).toLocaleDateString('en-CA'),
        required: true,
        type: 'date',
      });
    } else if (typeof parsedData[prop] === 'boolean') {  // type="checkbox"
      item = new TextboxControl({
        key: prop,
        label: prop,
        value: parsedData[prop],
        required: false,
        checked: parsedData[prop],
        type: 'checkbox',
      });
    } else if (parsedData[prop] && parsedData[prop].toString().includes(',')) {  // type="radio"
      item = new TextboxControl({
        key: prop,
        label: prop,
        value: parsedData[prop],
        required: false,
        checked: parsedData[prop],
        type: 'radio',
      });
    } else {  // normal type -> type="text"
      item = new TextboxControl({
        key: prop,
        label: prop,
        value: parsedData[prop],
        required: true,
      });
    }
    return item;
  }

  private buildListDataControl(arrOfProp) {
    let dropDownOptionsArr = [];
    if (arrOfProp && arrOfProp.length) {
      arrOfProp.forEach((item) => {
        if (item && typeof item === 'object') {
          // if array have objects !!
          for (let key in item) {
            dropDownOptionsArr.push({
              key: key,
              value: item[key],
              selected: true,
            });
          }
        } else {
          // array have values ..
          dropDownOptionsArr.push({ key: item, value: item, selected: true });
        }
      });
    }
    return dropDownOptionsArr;
  }
}

// Samples Data ....

/**
 * 
{
  "additionalCommercialRegister": "0000",
  "address": "Mansoura",
  "bankAccount": "000",
  "bankId": 3,
  "categoryTrack": [{"attachmentId": 10740, "attachmentTypeId": 1}],
  "certificateExpireDate": "2020-12-29T22:00:00.000Z",
  "certificateNumber": "000",
  "countryId": 1,
  "email": "ashafik@tafeel.com",
  "firstName": "Ebrahiem",
  "ibanNumber": "0000",
  "id": "713a5817-cba0-40fe-b70c-a008b68477fb",
  "lastName": "Gamal",
  "mobile": "01145207947",
  "tax": true,
  "zaka": false,
  "userName": "HemaDev",
  "vendorCategoryId": 3,
  "vendorTypeLookupCodeId": 1
} 
 */

/**
  * 
{
  "simple key":"simple value",
  "numbers":1234567,
  "simple list":[
    "value1",
    22222,
    "value3"
  ],
  "special value":"undefined",
  "owner":"null",
  "simple obect":{
    "simple key":"simple value",
    "numbers":1234567,
    "simple list":[
      "value1",
      22222,
      "value3"
    ]
  }
}
  */
