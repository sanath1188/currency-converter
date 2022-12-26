import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencyConverterRoutingModule } from './currency-converter-routing.module';
import { CurrencyConverterComponent } from './currency-converter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectModule } from '../commons/select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CurrencyConverterComponent],
  imports: [
    CommonModule,
    CurrencyConverterRoutingModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CurrencyConverterModule { }
