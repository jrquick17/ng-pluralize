import {Component} from '@angular/core';
import {PluralizeService} from 'ng-pluralize';

@Component({
  selector:    'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ]
})
export class AppComponent {
  title = 'ng-pluralize-demo';

  public word:string = '';

  constructor(
    private service:PluralizeService
  ) {

  }

  goToGitHub():void {
    window.location.href = 'https://github.com/jrquick17/ng-pluralize';
  }

  isSingular(word:string):boolean {
    return this.service.isSingular(word);
  }

  update():void {
    if (this.isSingular(this.word)) {
      this.word = this.service.pluralize(this.word, 2, true);
    } else {
      this.word = this.service.singular(this.word);
    }
  }
}
