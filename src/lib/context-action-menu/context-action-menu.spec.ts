
import {async, ComponentFixture, TestBed, inject, fakeAsync, flush} from '@angular/core/testing';
import {Component, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {By} from '@angular/platform-browser';
import {GhContextActionMenuModule, GhContextActionMenu, GhContextActionMenuItem} from './index';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {ENTER, SPACE} from '@angular/cdk/keycodes';
import {
  dispatchKeyboardEvent,
} from '@dynatrace/ngx-groundhog/core';

describe('GhContextActionMenu', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;

  function configureGhContextActionMenuTestingModule(declarations) {
    TestBed.configureTestingModule({
      imports: [
        GhContextActionMenuModule,
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
      configureGhContextActionMenuTestingModule([
        BasicCaMenu
      ]);
    }));
    describe('accessibility', () => {
      describe('for context-action-menu', () => {
        let fixture: ComponentFixture<BasicCaMenu>;
        let caMenu: HTMLElement;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(BasicCaMenu);
          fixture.detectChanges();
          caMenu = fixture.debugElement.query(By.css('.gh-context-action-menu')).nativeElement;
        }));

        it('should set the role of the overlay to dialog', fakeAsync(() => {
          fixture.componentInstance.caMenu.open();
          fixture.detectChanges();
          flush();
          const caMenuPanel = fixture.debugElement.query(By.css('.gh-ca-menu-panel')).nativeElement;
          expect(caMenuPanel.getAttribute('role')).toEqual('dialog');
        }));

        it('should set the aria label of the caMenu to the fallback', fakeAsync(() => {
          expect(caMenu.getAttribute('aria-label')).toEqual('Context action menu');
        }));

        it('should support setting a custom aria-label', fakeAsync(() => {
          fixture.componentInstance.ariaLabel = 'Custom Label';
          fixture.detectChanges();
          expect(caMenu.getAttribute('aria-label')).toEqual('Custom Label');
        }));

        it('should set the tabindex of the select to 0 by default', fakeAsync(() => {
          expect(caMenu.getAttribute('tabindex')).toEqual('0');
        }));

        it('should be able to override the tabindex', fakeAsync(() => {
          fixture.componentInstance.tabIndexOverride = 3;
          fixture.detectChanges();
          expect(caMenu.getAttribute('tabindex')).toBe('3');
        }));

        it('should set aria-disabled for disabled context action menus', fakeAsync(() => {
          expect(caMenu.getAttribute('aria-disabled')).toEqual('false');
          fixture.componentInstance.disabled = true;
          fixture.detectChanges();
          expect(caMenu.getAttribute('aria-disabled')).toEqual('true');
        }));

        it('should set the tabindex of the context action menu to -1 if disabled', fakeAsync(() => {
          fixture.componentInstance.disabled = true;
          fixture.detectChanges();
          expect(caMenu.getAttribute('tabindex')).toEqual('-1');
          fixture.componentInstance.disabled = false;
          fixture.detectChanges();
          expect(caMenu.getAttribute('tabindex')).toEqual('0');
        }));

        it('should be able to focus the context action menu', fakeAsync(() => {
          document.body.focus(); // ensure that focus isn't on the trigger already
          fixture.componentInstance.caMenu.focus();

          expect(document.activeElement).toBe(caMenu,
            'Expected context action menu element to be focused.');
        }));
      });
    });
  });
});

////////////////////////////////////////
// Testing components
////////////////////////////////////////

@Component({
  selector: 'basic-ca-menu',
  template: `
  <gh-ca-menu [aria-label]="ariaLabel" [tabIndex]="tabIndexOverride" [disabled]="disabled">
    <gh-ca-menu-item>Edit</gh-ca-menu-item>
    <gh-ca-menu-item>Approve</gh-ca-menu-item>
    <gh-ca-menu-item>Delete</gh-ca-menu-item>
  </gh-ca-menu>
  `
})
class BasicCaMenu {
  tabIndexOverride: number;
  ariaLabel: string;
  disabled: boolean;

  @ViewChild(GhContextActionMenu) caMenu: GhContextActionMenu;
  @ViewChildren(GhContextActionMenuItem) items: QueryList<GhContextActionMenuItem>;
}
