import { Component, EventEmitter, Input, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements ControlValueAccessor {
  @ViewChild(NgSelectComponent, {static: false}) dropdownSelect: NgSelectComponent;

  @Input() select: any;
  @Input() disabled: boolean;
  @Input() value: any;
  @Input() showError: boolean;

  @Output() itemSelected = new EventEmitter<any>();
  @Output() itemSearched = new EventEmitter<any>();
  @Output() opened = new EventEmitter<any>();
  @Output() scrolledToEnd = new EventEmitter<any>();
  @Output() optionClicked = new EventEmitter<any>();
  @Output() closed = new EventEmitter<any>();
  @Output() cleared = new EventEmitter<any>();
  @Output() focused = new EventEmitter<any>();

  searchUpdate = new Subject<any>();
  isFocused: boolean = false;

  constructor(
    /** Retrieve the dependency only from the local injector, not from parent or ancestors. */
    @Self()
    /** We want to be able to use the component without a form, so we mark the dependency as optional. */
    @Optional()
    public ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    /**
     * What is debouncing? - It's a way to add a small delay between multiple triggers.
     * Here, the user can type multiple characters in the search box. We shouldn't be making
     * API calls for every character searched (RIP db). Instead, we wait for 500ms before making the API call.
     * A normal user would type the next character within 500ms.
     */
    this.searchUpdate.pipe(
      debounceTime(500),
      distinctUntilChanged()).subscribe((searchText) => {
      if (searchText != null && (searchText === '' || searchText)) {
        this.itemSearched.emit();
      }
    }
    );
  }

  /**
   * Function that emits when an item is selected in the dropdown.
   */
  public selected(selectEvent: any) {
    if (selectEvent) {
      this.select.searchedTerm = '';
      this.ngControl?.control?.setValue(this.value);
      this.ngControl?.control?.markAllAsTouched();
      this.ngControl?.control?.markAsDirty();

      this.ngControl?.control?.updateValueAndValidity();
      this.itemSelected.emit(this.value);

      if (this.select.clearOnSelection) {
        this.dropdownSelect.handleClearClick();
      }
    }
  }

  /**
   * Function that triggers when a user searches for a term in the dropdown.
   *
   * @param event - searched term
   */
  public onSearch(event: any) {
    /** Only the select that be shown with a loader, we are making the loading as true */
    if (!this.select.hideLoader) {
      this.select.loading = true;
    }

    this.select.page = 1;
    this.select.searchedTerm = event.term;
    this.searchUpdate.next(event.term);

    if (this.select?.clearSelectedValue && !this.select?.searchedTerm?.trim()) {
      this.dropdownSelect.handleClearClick();
    }
  }

  /**
   * Function that triggers when the user has scrolled to the bottom of dropdown.
   */
  public onScrollToEnd() {
    this.select.page++;

    this.scrolledToEnd.emit();
  }

  /**
   * Function that triggers when a user scrolls in the dropdown.
   *
   * @param event - starting index and ending index of items at the scrolled position.
   */
  public onScroll(event: any) {
    const start = event.start;
    const end = event.end;

    if (this.select.loading) {
      return;
    }

    /** Do not trigger again if the user is still viewing the start of the list.
     * Load more when the user has only 5 more items in the existing list to view.
     */
    if (end + 5 > this.select.items.length && start > 0) {
      this.select.page++;

      this.scrolledToEnd.emit();
    }
  }

  /**
   * Function that triggers when the dropdown is opened.
   */
  public open() {
    if (this.select.clearSelectedValue) {
      if (!this.value) {
        this.select.page = 1;
        this.select.searchedTerm = '';
        this.opened.emit();
      }
    } else {
      this.select.page = 1;
      this.select.searchedTerm = '';
      this.opened.emit();
    }
  }

  /**
   * Function that triggers when dropdown is closed
   */
  public close() {
    this.closed.emit(this.value);
    this.searchUpdate.next(null);
  }

  /**
   * Function that triggers when selected value is cleared
   */
  public clear() {
    this.cleared.emit();
  }

  /**
   * Function that triggers when the dropdown is closed after being opened.
   */
  public blur() {
    if (!this.value) {
      this.ngControl?.control?.setValue(this.value);
      this.ngControl?.control?.markAllAsTouched();
      this.ngControl?.control?.markAsDirty();

      this.ngControl?.control?.updateValueAndValidity();
    }

    this.isFocused = false;
  }

  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: any): void {
    this.value = value;
  }

  /**
   * Write form disabled state to the DOM element (model => view)
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Update form when DOM element value changes (view => model)
   */
  registerOnChange(fn: any): void {
    /** Store the provided function as an internal method. */
    this.onChange = fn;
  }

  /**
   * Update form when DOM element is blurred (view => model)
   */
  registerOnTouched(fn: any): void {
    /** Store the provided function as an internal method. */
    this.onTouched = fn;
  }

  public onChange(value) { }
  public onTouched() { }

  /**
   * Update focus value for the icons.
   */
  public onFocus() {
    this.isFocused = true;
    this.focused.emit();
  }

  /**
   * custom search function that triggers while searching if it is enabled
   *
   * @param term - search term
   * @param item - individual dropdown value
   */
  customSearch(term: string, item: any): boolean {
    term = term.toLowerCase();
    return item.label.toLowerCase().indexOf(term) > -1 || item.name.toLowerCase().indexOf(term) > -1;
  }

  /** This function will hard reset the value of the ng select */
  public resetValue() {
    this.value = null;
    this.dropdownSelect.clearModel();
    this.dropdownSelect.handleClearClick();
  }
}
