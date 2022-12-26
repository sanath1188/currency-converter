import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // Change this to homepage after building it.
  { path: '', redirectTo: 'convert', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import(`./login/login.module`).then(m => m.LoginModule) },
  { path: 'convert', loadChildren: () => import(`./currency-converter/currency-converter.module`).then(m => m.CurrencyConverterModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
