import {NgModule} from '@angular/core';

import {NgPluralizeService} from './services/ng-pluralize.service';

@NgModule({
  providers: [
    NgPluralizeService
  ]
})
export class NgPluralizeModule {}
