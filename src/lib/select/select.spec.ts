import {Component, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {
  inject,
  TestBed,
  async,
  ComponentFixture,
  fakeAsync,
  tick,
  flush
} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Platform} from '@angular/cdk/platform';
import {GhSelectModule, GhSelect, GhOption} from './index';
import {DOWN_ARROW, UP_ARROW} from '@angular/cdk/keycodes';
import {SPACE} from '@angular/cdk/keycodes';
import {map} from 'rxjs/operators/map';
import {
  dispatchKeyboardEvent,
  dispatchEvent,
} from '@dynatrace/ngx-groundhog/core';
import {createKeyboardEvent} from '@dynatrace/ngx-groundhog/core';

describe('GhSelect', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;

  function configureGhSelectTestingModule(declarations) {
    TestBed.configureTestingModule({
      imports: [
        GhSelectModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      declarations: declarations,
    }).compileComponents();

    inject([OverlayContainer, Platform], (oc: OverlayContainer, p: Platform) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
      platform = p;
    })();
  }

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  describe('core', () => {
    beforeEach(async(() => {
      configureGhSelectTestingModule([
        BasicSelect
      ]);
    }));

    describe('accessibility', () => {
      describe('for select', () => {
        let fixture: ComponentFixture<BasicSelect>;
        let select: HTMLElement;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(BasicSelect);
          fixture.detectChanges();
          select = fixture.debugElement.query(By.css('gh-select')).nativeElement;
        }));

        it('should set the role of the select to listbox', fakeAsync(() => {
          expect(select.getAttribute('role')).toEqual('listbox');
        }));

        it('should set the aria label of the select to the placeholder', fakeAsync(() => {
          expect(select.getAttribute('aria-label')).toEqual('Food');
        }));

        it('should support setting a custom aria-label', fakeAsync(() => {
          fixture.componentInstance.ariaLabel = 'Custom Label';
          fixture.detectChanges();
          expect(select.getAttribute('aria-label')).toEqual('Custom Label');
        }));

        it('should not set an aria-label if aria-labelledby is specified', fakeAsync(() => {
          fixture.componentInstance.ariaLabelledby = 'myLabelId';
          fixture.detectChanges();
          expect(select.getAttribute('aria-label')).toBeFalsy('Expected no aria-label to be set.');
          expect(select.getAttribute('aria-labelledby')).toBe('myLabelId');
        }));

        it('should not have aria-labelledby in the DOM if it`s not specified', fakeAsync(() => {
          fixture.detectChanges();
          expect(select.hasAttribute('aria-labelledby')).toBeFalsy();
        }));

        it('should set the tabindex of the select to 0 by default', fakeAsync(() => {
          expect(select.getAttribute('tabindex')).toEqual('0');
        }));

        it('should be able to override the tabindex', fakeAsync(() => {
          fixture.componentInstance.tabIndexOverride = 3;
          fixture.detectChanges();
          expect(select.getAttribute('tabindex')).toBe('3');
        }));

        it('should set aria-required for required selects', fakeAsync(() => {
          expect(select.getAttribute('aria-required'))
            .toEqual('false', `Expected aria-required attr to be false for normal selects.`);
          fixture.componentInstance.isRequired = true;
          fixture.detectChanges();
          expect(select.getAttribute('aria-required'))
            .toEqual('true', `Expected aria-required attr to be true for required selects.`);
        }));

        it('should set the gh-select-required class for required selects', fakeAsync(() => {
          expect(select.classList).not.toContain(
            'gh-select-required', `Expected the gh-select-required class not to be set.`);
          fixture.componentInstance.isRequired = true;
          fixture.detectChanges();
          expect(select.classList).toContain(
            'gh-select-required', `Expected the gh-select-required class to be set.`);
        }));

        it('should set aria-invalid for selects that are invalid and dirty', fakeAsync(() => {
          expect(select.getAttribute('aria-invalid'))
            .toEqual('false', `Expected aria-invalid attr to be false for valid selects.`);
          fixture.componentInstance.isRequired = true;
          fixture.componentInstance.control.markAsDirty();
          fixture.detectChanges();
          expect(select.getAttribute('aria-invalid'))
            .toEqual('true', `Expected aria-invalid attr to be true for invalid selects.`);
        }));

        it('should set aria-disabled for disabled selects', fakeAsync(() => {
          expect(select.getAttribute('aria-disabled')).toEqual('false');
          fixture.componentInstance.control.disable();
          fixture.detectChanges();
          expect(select.getAttribute('aria-disabled')).toEqual('true');
        }));

        it('should set the tabindex of the select to -1 if disabled', fakeAsync(() => {
          fixture.componentInstance.control.disable();
          fixture.detectChanges();
          expect(select.getAttribute('tabindex')).toEqual('-1');
          fixture.componentInstance.control.enable();
          fixture.detectChanges();
          expect(select.getAttribute('tabindex')).toEqual('0');
        }));

        it('should select options via the UP/DOWN arrow keys on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(options[0].selected).toBe(true, 'Expected first option to be selected.');
          expect(formControl.value).toBe(options[0].value,
            'Expected value from first option to have been set on the model.');

            dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          // Note that the third option is skipped, because it is disabled.
          expect(options[3].selected).toBe(true, 'Expected fourth option to be selected.');
          expect(formControl.value).toBe(options[3].value,
            'Expected value from fourth option to have been set on the model.');

            dispatchKeyboardEvent(select, 'keydown', UP_ARROW);

          expect(options[1].selected).toBe(true, 'Expected second option to be selected.');
          expect(formControl.value).toBe(options[1].value,
            'Expected value from second option to have been set on the model.');
        }));

        it('should open a single-selection select using ALT + DOWN_ARROW', fakeAsync(() => {
          const {control: formControl, select: selectInstance} = fixture.componentInstance;

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(formControl.value).toBeFalsy('Expected no initial value.');

          const event = createKeyboardEvent('keydown', DOWN_ARROW);
          Object.defineProperty(event, 'altKey', {get: () => true});

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');
          expect(formControl.value).toBeFalsy('Expected value not to have changed.');
        }));

        it('should open a single-selection select using ALT + UP_ARROW', fakeAsync(() => {
          const {control: formControl, select: selectInstance} = fixture.componentInstance;

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(formControl.value).toBeFalsy('Expected no initial value.');

          const event = createKeyboardEvent('keydown', UP_ARROW);
          Object.defineProperty(event, 'altKey', {get: () => true});

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');
          expect(formControl.value).toBeFalsy('Expected value not to have changed.');
        }));

        it('should should close when pressing ALT + DOWN_ARROW', fakeAsync(() => {
          const {select: selectInstance} = fixture.componentInstance;

          selectInstance.open();
          fixture.detectChanges();

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');

          const event = createKeyboardEvent('keydown', DOWN_ARROW);
          Object.defineProperty(event, 'altKey', {get: () => true});

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(event.defaultPrevented).toBe(true, 'Expected default action to be prevented.');
        }));

        it('should should close when pressing ALT + UP_ARROW', fakeAsync(() => {
          const {select: selectInstance} = fixture.componentInstance;

          selectInstance.open();
          fixture.detectChanges();

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');

          const event = createKeyboardEvent('keydown', UP_ARROW);
          Object.defineProperty(event, 'altKey', {get: () => true});

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(event.defaultPrevented).toBe(true, 'Expected default action to be prevented.');
        }));

        it('should be able to select options by typing on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          dispatchEvent(select, createKeyboardEvent('keydown', 80, undefined, 'p'));
          tick(200);

          expect(options[1].selected).toBe(true, 'Expected second option to be selected.');
          expect(formControl.value).toBe(options[1].value,
            'Expected value from second option to have been set on the model.');

          dispatchEvent(select, createKeyboardEvent('keydown', 69, undefined, 'e'));
          tick(200);

          expect(options[5].selected).toBe(true, 'Expected sixth option to be selected.');
          expect(formControl.value).toBe(options[5].value,
            'Expected value from sixth option to have been set on the model.');
        }));

        it('should do nothing if the key manager did not change the active item', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;

          expect(formControl.value).toBeNull('Expected form control value to be empty.');
          expect(formControl.pristine).toBe(true, 'Expected form control to be clean.');

          dispatchKeyboardEvent(select, 'keydown', 16); // Press a random key.
          expect(formControl.value).toBeNull('Expected form control value to stay empty.');
          expect(formControl.pristine).toBe(true, 'Expected form control to stay clean.');
        }));

        it('should continue from the selected option when the value is set programmatically',
          fakeAsync(() => {
            const formControl = fixture.componentInstance.control;

            formControl.setValue('eggs-5');
            fixture.detectChanges();

            dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

            expect(formControl.value).toBe('pasta-6');
            expect(fixture.componentInstance.options.toArray()[6].selected).toBe(true);
          }));

        it('should not shift focus when the selected options are updated programmatically ' +
            'in a multi select', fakeAsync(() => {

          select = fixture.debugElement.query(By.css('gh-select')).nativeElement;
          fixture.componentInstance.select.open();
          fixture.detectChanges();

          const options =
            overlayContainerElement.querySelectorAll('gh-option') as NodeListOf<HTMLElement>;

          options[3].focus();
          expect(document.activeElement).toBe(options[3], 'Expected fourth option to be focused.');

          fixture.componentInstance.control.setValue(['steak-0', 'sushi-7']);
          fixture.detectChanges();

          expect(document.activeElement)
              .toBe(options[3], 'Expected fourth option to remain focused.');
        }));

        it('should not cycle through the options if the control is disabled', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          formControl.setValue('eggs-5');
          formControl.disable();
          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          expect(formControl.value).toBe('eggs-5', 'Expected value to remain unchaged.');
        }));

        it('should not cycle through the options if the control is disabled', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          formControl.setValue('eggs-5');
          formControl.disable();
          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          expect(formControl.value).toBe('eggs-5', 'Expected value to remain unchaged.');
        }));

        it('should not wrap selection after reaching the end of the options', fakeAsync(() => {
          const lastOption = fixture.componentInstance.options.last;
          fixture.componentInstance.options.forEach(() => {
            dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          });
          expect(lastOption.selected).toBe(true, 'Expected last option to be selected.');
          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          expect(lastOption.selected).toBe(true, 'Expected last option to stay selected.');
        }));

        it('should prevent the default action when pressing space', fakeAsync(() => {
          const event = dispatchKeyboardEvent(select, 'keydown', SPACE);
          expect(event.defaultPrevented).toBe(true);
        }));

        it('should consider the selection a result of a user action when closed', fakeAsync(() => {
          const option = fixture.componentInstance.options.first;
          const spy = jasmine.createSpy('option selection spy');
          const subscription =
              option.onSelectionChange.pipe(map(e => e.isUserInput)).subscribe(spy);

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          expect(spy).toHaveBeenCalledWith(true);

          subscription.unsubscribe();
        }));

        it('should be able to focus the select trigger', fakeAsync(() => {
          document.body.focus(); // ensure that focus isn't on the trigger already
          fixture.componentInstance.select.focus();

          expect(document.activeElement).toBe(select, 'Expected select element to be focused.');
        }));

        // Having `aria-hidden` on the trigger avoids issues where
        // screen readers read out the wrong amount of options.
        it('should set aria-hidden on the trigger element', fakeAsync(() => {
          const trigger = fixture.debugElement.query(By.css('.gh-select-trigger')).nativeElement;

          expect(trigger.getAttribute('aria-hidden'))
              .toBe('true', 'Expected aria-hidden to be true when the select is open.');
        }));

        it('should set aria-multiselectable false on single-selection instances', fakeAsync(() => {
          expect(select.getAttribute('aria-multiselectable')).toBe('false');
        }));

        it('should set aria-activedescendant only while the panel is open', fakeAsync(() => {
          fixture.componentInstance.control.setValue('chips-4');
          fixture.detectChanges();

          const host = fixture.debugElement.query(By.css('gh-select')).nativeElement;

          expect(host.hasAttribute('aria-activedescendant'))
              .toBe(false, 'Expected no aria-activedescendant on init.');

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options = overlayContainerElement.querySelectorAll('gh-option');

          expect(host.getAttribute('aria-activedescendant'))
              .toBe(options[4].id, 'Expected aria-activedescendant to match the active option.');

          fixture.componentInstance.select.close();
          fixture.detectChanges();
          flush();

          expect(host.hasAttribute('aria-activedescendant'))
              .toBe(false, 'Expected no aria-activedescendant when closed.');
        }));

        it('should set aria-activedescendant based on the focused option', fakeAsync(() => {
          const host = fixture.debugElement.query(By.css('gh-select')).nativeElement;

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options = overlayContainerElement.querySelectorAll('gh-option');

          expect(host.getAttribute('aria-activedescendant')).toBe(options[0].id);

          [1, 2, 3].forEach(() => {
            dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
            fixture.detectChanges();
          });

          expect(host.getAttribute('aria-activedescendant')).toBe(options[4].id);

          dispatchKeyboardEvent(host, 'keydown', UP_ARROW);
          fixture.detectChanges();

          expect(host.getAttribute('aria-activedescendant')).toBe(options[3].id);
        }));
      });

      describe('for options', () => {
        let fixture: ComponentFixture<BasicSelect>;
        let trigger: HTMLElement;
        let options: NodeListOf<HTMLElement>;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(BasicSelect);
          fixture.detectChanges();
          trigger = fixture.debugElement.query(By.css('.gh-select-trigger')).nativeElement;
          trigger.click();
          fixture.detectChanges();

          options =
              overlayContainerElement.querySelectorAll('gh-option') as NodeListOf<HTMLElement>;
        }));

        it('should set the role of gh-option to option', fakeAsync(() => {
          expect(options[0].getAttribute('role')).toEqual('option');
          expect(options[1].getAttribute('role')).toEqual('option');
          expect(options[2].getAttribute('role')).toEqual('option');
        }));

        it('should set aria-selected on each option', fakeAsync(() => {
          expect(options[0].getAttribute('aria-selected')).toEqual('false');
          expect(options[1].getAttribute('aria-selected')).toEqual('false');
          expect(options[2].getAttribute('aria-selected')).toEqual('false');

          options[1].click();
          fixture.detectChanges();

          trigger.click();
          fixture.detectChanges();
          flush();

          expect(options[0].getAttribute('aria-selected')).toEqual('false');
          expect(options[1].getAttribute('aria-selected')).toEqual('true');
          expect(options[2].getAttribute('aria-selected')).toEqual('false');
        }));

        it('should set the tabindex of each option according to disabled state', fakeAsync(() => {
          expect(options[0].getAttribute('tabindex')).toEqual('0');
          expect(options[1].getAttribute('tabindex')).toEqual('0');
          expect(options[2].getAttribute('tabindex')).toEqual('-1');
        }));

        it('should set aria-disabled for disabled options', fakeAsync(() => {
          expect(options[0].getAttribute('aria-disabled')).toEqual('false');
          expect(options[1].getAttribute('aria-disabled')).toEqual('false');
          expect(options[2].getAttribute('aria-disabled')).toEqual('true');

          fixture.componentInstance.foods[2]['disabled'] = false;
          fixture.detectChanges();

          expect(options[0].getAttribute('aria-disabled')).toEqual('false');
          expect(options[1].getAttribute('aria-disabled')).toEqual('false');
          expect(options[2].getAttribute('aria-disabled')).toEqual('false');
        }));
      });

    });
  });
});

////////////////////////////////////////
// Testing components
////////////////////////////////////////

@Component({
  selector: 'basic-select',
  template: `
    <div [style.height.px]="heightAbove"></div>
      <gh-select placeholder="Food" [formControl]="control" [required]="isRequired"
        [tabIndex]="tabIndexOverride" [aria-label]="ariaLabel" [aria-labelledby]="ariaLabelledby"
        [panelClass]="panelClass">
        <gh-option *ngFor="let food of foods" [value]="food.value" [disabled]="food.disabled">
          {{ food.viewValue }}
        </gh-option>
      </gh-select>
    <div [style.height.px]="heightBelow"></div>
  `
})
class BasicSelect {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos', disabled: true },
    { value: 'sandwich-3', viewValue: 'Sandwich' },
    { value: 'chips-4', viewValue: 'Chips' },
    { value: 'eggs-5', viewValue: 'Eggs' },
    { value: 'pasta-6', viewValue: 'Pasta' },
    { value: 'sushi-7', viewValue: 'Sushi' },
  ];
  control = new FormControl();
  isRequired: boolean;
  heightAbove = 0;
  heightBelow = 0;
  tabIndexOverride: number;
  ariaLabel: string;
  ariaLabelledby: string;
  panelClass = ['custom-one', 'custom-two'];

  @ViewChild(GhSelect) select: GhSelect;
  @ViewChildren(GhOption) options: QueryList<GhOption>;
}
