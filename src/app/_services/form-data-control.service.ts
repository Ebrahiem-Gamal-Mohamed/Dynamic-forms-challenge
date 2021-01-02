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
        formData = this.buildFormControls(parsedData);
      } catch(e) {
        console.log('Error happend when parsing json data : ', e);
      }
    }

    return of(formData);
  }

  private buildFormControls(parsedData) {
    let formArr = [];
    for (let prop in parsedData) {
      let item;
      if (parsedData[prop] && (Array.isArray(parsedData[prop]) || parsedData[prop].toString().includes(','))) {
        item = new DropDownControl({ // dropdown list...
          "key": prop,
          "label": prop,
          "options": this.buildDropDownControl(parsedData[prop]),
          "required": false
        });
      } else if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(parsedData[prop])) {
        item = new TextboxControl({ // type="Email"
          "key": prop,
          "label": prop,
          "value": parsedData[prop],
          "required": true,
          "type": "email" 
        });
      } else if (String(parsedData[prop]).match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)) {
        item = new TextboxControl({ // type="date"
          "key": prop,
          "label": prop,
          "value": new Date(parsedData[prop]).toLocaleDateString('en-CA'),
          "required": true,
          "type": "date"
        });
      } else if (typeof parsedData[prop] === "boolean") {// type="checkbox"
        item = new TextboxControl({
          "key": prop,
          "label": prop,
          "value": parsedData[prop],
          "required": false,
          "checked": parsedData[prop],
          "type": "checkbox"
        });
      } else { // normal type > type="text"
        item = new TextboxControl({
          "key": prop,
          "label": prop,
          "value": parsedData[prop],
          "required": true
        });
      }
      formArr.push(item);
    }
    return formArr;
  }

  private buildDropDownControl(arrOfProp) {
    let dropDownOptionsArr = [];
    if (arrOfProp && arrOfProp.length) {
      arrOfProp.forEach(item => {
        if (item && typeof item === "object") { // if array have objects !!
          for(let key in item) {
            dropDownOptionsArr.push({ "key": key, "value": item[key], "selected": true }); 
          }
        } else { // array have values ..
          dropDownOptionsArr.push({ "key": item, "value": item, "selected": true });
        }
      });
    }
    return dropDownOptionsArr;
  }
}

// Samples Data ....
// [
//   new DropDownControl({
// "key": "brave",
// "label": "Bravery Rating",
//   "options": [
//     { "key": "solid", "value": "Solid" },
//     { "key": "great", "value": "Great" },
//     { "key": "good", "value": "Good" },
//     { "key": "unproven", "value": "Unproven" }
//     ],
//   "order": 3
// }),
// new TextboxControl({
//   "key": "firstName",
//   "label": "First name",
//   "value": "Bombasto",
//   "required": true,
//   "order": 1
// }),
//   new TextboxControl({
//     "key": "emailAddress",
//     "label": "Email",
//     "type": "email",
//     "order": 2
//   }),
// ]

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
"firstName": "مصطفى",
"ibanNumber": "0000",
"id": "713a5817-cba0-40fe-b70c-a008b68477fb",
"lastName": false,
"mobile": "01145207947",
"nameAr": "مصطفى صاصا",
"nameEn": "Mostafa Sasa",
"taxNumber": true,
"userName": "SasaAhmed",
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
  "owner":null,
  "simple obect":{
    "simple key":"simple value",
    "numbers":1234567,
    "simple list":[
      "value1",
      22222,
      "value3"
    ],
    "simple obect":{
      "key1":"value1",
      "key2":22222,
      "key3":"value3"
    }
  }
}
  */
