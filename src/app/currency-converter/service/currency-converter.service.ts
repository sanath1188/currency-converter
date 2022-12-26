import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConverterService {

  constructor(private http: HttpClient) { }

  /**
   * Function that fetches the list of currency
   */
  public getCurrency(): Observable<any> {
    return this.http
      .get<any>("http://localhost:3000/api/currency");
  }
  
  /**
   * Function the fetches the converted rate.
   * 
   * @param from - source currency to convert
   * @param to - desination currency to convert to
   * @param amount - amount to convert
   */
  public getRate(from: string, to: string, amount: number): Observable<any> {
    const params: any = {};

    params.from = from;
    params.to = to;
    params.amount = amount;

    return this.http
      .get<any>("http://localhost:3000/api/conversion", {params});
  }
}
