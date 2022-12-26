import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormControl, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    const NG_CONTROL_PROVIDER = {
      provide: NgControl,
      useClass: class extends NgControl {
        control = new FormControl();
        viewToModelUpdate() { }
      },
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, NgSelectModule],
      declarations: [SelectComponent],
    }).overrideComponent(SelectComponent, {
      add: { providers: [NG_CONTROL_PROVIDER] },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    component.select = {
      items: [],
      page: 1,
      searchedTerm: '',
      clearSelectedValue:'true',
      clearOnSelection:'true'
    }
    component.value = '69';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOninit', () => {
    it('should emit changes', fakeAsync(() => {
      const PASSED_SEARCH = 'g500';

      spyOn(component.itemSearched, 'emit');

      component.searchUpdate.next(PASSED_SEARCH);

      tick(500);

      expect(component.itemSearched.emit).toHaveBeenCalled();
    }));

    it('should emit changes', fakeAsync(() => {
      const PASSED_SEARCH = null;

      spyOn(component.itemSearched, 'emit');

      component.searchUpdate.next(PASSED_SEARCH);

      tick(500);

      expect(component.itemSearched.emit).not.toHaveBeenCalled();
    }));
  });

  describe('selected', () => {
    it('should emit changes', () => {
      const event = {
        label: 'Rick',
        value: 69
      };

      spyOn(component.itemSelected, 'emit');

      component.selected(event);

      fixture.detectChanges();

      expect(component.itemSelected.emit).toHaveBeenCalledWith(component.value);
    });

    it('should emit changes even when control is absent', () => {
      const event = {
        label: 'Rick',
        value: 69
      };

      spyOn(component.itemSelected, 'emit');

      component.ngControl = null;
      component.selected(event);

      fixture.detectChanges();

      expect(component.itemSelected.emit).toHaveBeenCalledWith(component.value);
    });
  });

  describe('onSearch', () => {
    it('should emit changes', () => {
      spyOn(component.searchUpdate, "next")

      const PASSED_EVENT = {
        term: 'Rick'
      }

      component.onSearch(PASSED_EVENT);

      fixture.detectChanges();

      expect(component.searchUpdate.next).toHaveBeenCalledWith('Rick')
      expect(component.select.loading).toBeTruthy()
    });

    it('should emit changes and clearSelectedValue', () => {
      spyOn(component.searchUpdate, "next")

      component.select.hideLoader = true;

      const PASSED_EVENT = {
        term: ''
      }

      component.onSearch(PASSED_EVENT);

      fixture.detectChanges();

      expect(component.searchUpdate.next).toHaveBeenCalledWith('')
    });
  });

  describe('onScrollToEnd', () => {
    it('should emit changes', () => {
      spyOn(component.scrolledToEnd, 'emit');

      component.onScrollToEnd();

      fixture.detectChanges();

      expect(component.scrolledToEnd.emit).toHaveBeenCalledWith();
    });
  });

  describe('onScroll', () => {
    it('should emit changes', () => {
      spyOn(component.scrolledToEnd, 'emit');

      let PASSED_EVENT = {
        start: 10,
        end: 20
      }

      component.onScroll(PASSED_EVENT);

      fixture.detectChanges();

      expect(component.scrolledToEnd.emit).toHaveBeenCalledWith();

      PASSED_EVENT = {
        start: 0,
        end: 20
      }

      component.onScroll(PASSED_EVENT);

      fixture.detectChanges();

      expect(component.scrolledToEnd.emit).toHaveBeenCalledWith();

      component.select.loading = true;
      component.onScroll(PASSED_EVENT);
      fixture.detectChanges();

      expect(component.scrolledToEnd.emit).toHaveBeenCalledWith();
    });
  });

  describe('open', () => {
    it('should emit changes', () => {
      spyOn(component.opened, 'emit');

      component.select.clearSelectedValue = true;
      component.value = null;
      component.open();
      component.blur();

      fixture.detectChanges();

      expect(component.opened.emit).toHaveBeenCalledWith();
    });

    it('should emit changes', () => {
      spyOn(component.opened, 'emit');

      component.select.clearSelectedValue = false;
      component.value = null;
      component.open();

      fixture.detectChanges();

      expect(component.opened.emit).toHaveBeenCalledWith();
    });

    it('should emit changes when there is a value', () => {
      spyOn(component.opened, 'emit');

      component.select.clearSelectedValue = true;
      component.value = true;
      component.open();

      fixture.detectChanges();

      expect(component.opened.emit).not.toHaveBeenCalled();
    });

    it('should emit changes even when control is absent', () => {
      spyOn(component.opened, 'emit');

      component.select.clearSelectedValue = true;
      component.value = null;
      component.ngControl = null;
      component.open();
      component.blur();

      fixture.detectChanges();

      expect(component.opened.emit).toHaveBeenCalledWith();
    });
  });

  describe('setDisabledState', () => {
    it('should disable select', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBeTruthy();

      /** Randomly triggering interface functions */
      component.onChange('test');
      component.onTouched();
    })
  })

  describe('onFocus', () => {
    it('should call focus method', () => {
      spyOn(component.focused,'emit')
      component.onFocus();
  
      fixture.detectChanges();
  
      expect(component.isFocused).toBeTruthy();
      expect(component.focused.emit).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should emit changes', () => {
      spyOn(component.closed, 'emit');
      spyOn(component.searchUpdate, "next")


      component.close();

      fixture.detectChanges();

      expect(component.closed.emit).toHaveBeenCalledWith(component.value);
      expect(component.searchUpdate.next).toHaveBeenCalledWith(null)
    });
  });

  describe('clear', () => {
    it('should emit changes when the selected value is cleared', () => {
      spyOn(component.cleared, 'emit');

      component.clear();

      fixture.detectChanges();

      expect(component.cleared.emit).toHaveBeenCalled();
    });
  });
    
  describe('blur', () => {
    it('should call blur method', () => {
      component.value = {label: 'xyx', value: 2};

      component.blur();
  
      fixture.detectChanges();
  
      expect(component.ngControl.control.touched).toBeFalsy();
      expect(component.ngControl.control.dirty).toBeFalsy();
    });
  });

  describe('customSearch', () => {
    it('should call customSearch method while searching ', () => {
      component.select.customSearch = true;

      const itemValue = {label:'Test', value:'Test', name:'Test@email.com'};

      const result = component.customSearch('Test', itemValue);

      expect(result).toBe(true);
    });

    it('should call customSearch method while searching ', () => {
      component.select.customSearch = true;

      const itemValue = {label:'Test', value:'Test', name:'Test@email.com'};

      const result = component.customSearch('admin', itemValue);

      expect(result).toBe(false);
    });
  });

  describe('resetValue', () => {
    it('Should reset the value of the select and update both model and view', () => {
      spyOn(component.dropdownSelect, 'clearModel');
      spyOn(component.dropdownSelect, 'handleClearClick');

      component.resetValue();

      expect(component.dropdownSelect.clearModel).toHaveBeenCalled();
      expect(component.dropdownSelect.handleClearClick).toHaveBeenCalled();
      expect(component.value).toBe(null);
    });
  });
});
