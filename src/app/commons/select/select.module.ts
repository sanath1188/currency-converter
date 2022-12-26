import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectRoutingModule } from './select-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectComponent } from './select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [SelectComponent],
  imports: [
    CommonModule,
    SelectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  exports: [SelectComponent]
})
export class SelectModule { }
