import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CurrencyConverterService } from './service/currency-converter.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss']
})
export class CurrencyConverterComponent implements OnInit {
  amount: number;
  currencyList: any = [];
  calculatedConversion: number = 0;

  selectedFromCurrency: any = 'INR';
  selectedToCurrency: any = 'USD';

  latestUpdate: any = null;

  fromCurrencySelect: any = {
    items: [],
    clearable: false,
    virtualScroll: true,
    placeholder: 'From',
    errorMessages: {
      invalidError: '*Currency is invalid.'
    },
    onSelected: (selectedCurrency: any) => {
      this.selectedFromCurrency = selectedCurrency.label;
    },
    selectedValue: 'INR'
  };

  toCurrencySelect: any = {
    items: [],
    clearable: false,
    virtualScroll: true,
    placeholder: 'To',
    errorMessages: {
      invalidError: '*Currency is invalid.'
    },
    onSelected: (selectedCurrency: any) => {
      this.selectedToCurrency = selectedCurrency.label;
    },
    selectedValue: 'USD'
  };

  constructor(public currencyConverterSvc: CurrencyConverterService, private cdr: ChangeDetectorRef,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    /** Fetch the currency list after view has loaded. */
    this.currencyConverterSvc.getCurrency().subscribe(res => {
      this.fromCurrencySelect.items = this.toCurrencySelect.items = res.data.map(function(currency: any) {
        return {
          value: currency.exchange_rate,
          label: currency.currency
        };
      });

      this.cdr.detectChanges();
    }, (err) => {
      this.toastr.error('Error', 'Failed to fetch currency list!');
    })
  }

  /**
   * Function that swaps the from and to currency.
   */
  public swapSelectedCurrency() {
    let tempFrom = this.fromCurrencySelect.selectedValue;

    this.fromCurrencySelect.selectedValue = this.toCurrencySelect.selectedValue;
    this.toCurrencySelect.selectedValue = tempFrom;

    this.selectedFromCurrency = this.fromCurrencySelect.selectedValue;
    this.selectedToCurrency = this.toCurrencySelect.selectedValue;

    this.getRate();
  }

  /**
   * Function that fetches the converted amount
   */
  public getRate() {
    this.currencyConverterSvc.getRate(this.selectedFromCurrency, this.selectedToCurrency, this.amount).subscribe(res => {
      this.calculatedConversion = res.data.convertedAmount;
      this.latestUpdate = res.data.latestUpdate;

      this.cdr.detectChanges();
    }, (err) => {
      console.log(err)
      this.toastr.error(err.error.message, 'Failed to calculate conversion!');
    });
  }
}
