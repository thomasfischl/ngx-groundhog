import {
  async,
  ComponentFixture,
  TestBed,
  inject,
  fakeAsync,
  flush,
  flushMicrotasks,
  tick
} from '@angular/core/testing';
import {Component, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {By} from '@angular/platform-browser';
import {GhContextMenuModule, GhContextMenu, GhContextMenuItem} from './index';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {ENTER, SPACE, TAB} from '@angular/cdk/keycodes';
import {
  dispatchKeyboardEvent,
} from '@dynatrace/ngx-groundhog/core';

describe('GhContextMenu', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;

  function configureGhContextMenuTestingModule(declarations) {
    TestBed.configureTestingModule({
      imports: [
        GhContextMenuModule,
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
      configureGhContextMenuTestingModule([
        BasicContextMenu
      ]);
    }));
    describe('accessibility', () => {
      describe('for context-menu', () => {
        let fixture: ComponentFixture<BasicContextMenu>;
        let contextMenu: HTMLElement;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(BasicContextMenu);
          fixture.detectChanges();
          contextMenu = fixture.debugElement.query(By.css('.gh-context-menu')).nativeElement;
        }));

        it('should set the role of the overlay to dialog', fakeAsync(() => {
          fixture.componentInstance.contextMenu.open();
          fixture.detectChanges();
          flush();
          const contextMenuPanel = fixture.debugElement
            .query(By.css('.gh-context-menu-panel')).nativeElement;
          expect(contextMenuPanel.getAttribute('role')).toEqual('dialog');
        }));

        it('should set the aria label of the context menu to the fallback', fakeAsync(() => {
          expect(contextMenu.getAttribute('aria-label')).toEqual('Context menu');
        }));

        it('should support setting a custom aria-label', fakeAsync(() => {
          fixture.componentInstance.ariaLabel = 'Custom Label';
          fixture.detectChanges();
          expect(contextMenu.getAttribute('aria-label')).toEqual('Custom Label');
        }));

        it('should set the tabindex of the select to 0 by default', fakeAsync(() => {
          expect(contextMenu.getAttribute('tabindex')).toEqual('0');
        }));

        it('should be able to override the tabindex', fakeAsync(() => {
          fixture.componentInstance.tabIndexOverride = 3;
          fixture.detectChanges();
          expect(contextMenu.getAttribute('tabindex')).toBe('3');
        }));

        it('should set aria-disabled for disabled context  menus', fakeAsync(() => {
          expect(contextMenu.getAttribute('aria-disabled')).toEqual('false');
          fixture.componentInstance.disabled = true;
          fixture.detectChanges();
          expect(contextMenu.getAttribute('aria-disabled')).toEqual('true');
        }));

        it('should set the tabindex of the context menu to -1 if disabled', fakeAsync(() => {
          fixture.componentInstance.disabled = true;
          fixture.detectChanges();
          expect(contextMenu.getAttribute('tabindex')).toEqual('-1');
          fixture.componentInstance.disabled = false;
          fixture.detectChanges();
          expect(contextMenu.getAttribute('tabindex')).toEqual('0');
        }));

        it('should set the focus to the first button inside the overlay', fakeAsync(() => {
          fixture.componentInstance.contextMenu.open();
          fixture.detectChanges();
          flush();
          const buttons = overlayContainerElement.querySelectorAll('.gh-button');
          expect(document.activeElement).toBe(buttons[0],
            'Expected the first button inside the overlay to be focused.');
        }));

        it('should set the focus to the first enabled button inside the overlay', fakeAsync(() => {
          fixture.componentInstance.contextMenu.open();
          fixture.componentInstance.editDisabled = true;
          fixture.detectChanges();
          flush();
          const buttons = overlayContainerElement.querySelectorAll('.gh-button');
          expect(document.activeElement).toBe(buttons[1],
            'Expected the first button inside the overlay to be focused.');
        }));

        it('should be able to focus the context menu', fakeAsync(() => {
          document.body.focus(); // ensure that focus isn't on the trigger already
          fixture.componentInstance.contextMenu.focus();

          expect(document.activeElement).toBe(contextMenu,
            'Expected context  menu element to be focused.');
        }));
      });

      describe('for context-menu-items', () => {
        let fixture: ComponentFixture<BasicContextMenu>;
        let contextMenu: HTMLElement;
        let items: NodeListOf<HTMLElement>;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(BasicContextMenu);
          fixture.detectChanges();
          contextMenu = fixture.debugElement.query(By.css('.gh-context-menu')).nativeElement;
          const {contextMenu: contextMenuInstance} = fixture.componentInstance;

          contextMenuInstance.open();
          fixture.detectChanges();
          items = overlayContainerElement
              .querySelectorAll('gh-context-menu-item') as NodeListOf<HTMLElement>;
        }));

        it('should render gh-button variant="secondary" as menu items', fakeAsync(() => {
          [].slice.call(items).forEach(item => {
            expect(item.childNodes[0].getAttribute('variant')).toEqual('secondary');
          });
        }));

        it('should disable the button inside the menu item', fakeAsync(() => {
          fixture.componentInstance.editDisabled = true;
          fixture.detectChanges();
          expect((items[0].children[0] as HTMLButtonElement).disabled).toBe(true);
        }));
      });
    });
  });
});

////////////////////////////////////////
// Testing components
////////////////////////////////////////

@Component({
  selector: 'basic-context-menu',
  template: `
  <gh-context-menu [aria-label]="ariaLabel" [tabIndex]="tabIndexOverride" [disabled]="disabled">
    <gh-context-menu-item [disabled]="editDisabled">Edit</gh-context-menu-item>
    <gh-context-menu-item>Approve</gh-context-menu-item>
  </gh-context-menu>
  `
})
class BasicContextMenu {
  tabIndexOverride: number;
  ariaLabel: string;
  disabled: boolean;
  editDisabled: boolean = false;

  @ViewChild(GhContextMenu) contextMenu: GhContextMenu;
  @ViewChildren(GhContextMenuItem) items: QueryList<GhContextMenuItem>;
}
