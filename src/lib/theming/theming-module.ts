import { NgModule } from '@angular/core';
import { GhTheme } from './theming';

@NgModule({
  exports: [GhTheme],
  declarations: [GhTheme],
})
export class GhThemingModule {}
