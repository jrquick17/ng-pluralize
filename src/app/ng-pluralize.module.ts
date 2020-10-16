import {NgModule} from '@angular/core';

import {PluralizeService} from './services/pluralize.service';

@NgModule({
  providers: [
    PluralizeService
  ]
})
export class NgPluralizeModule {}
