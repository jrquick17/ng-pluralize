import {Component} from '@angular/core';
import {NgPluralizeService} from 'ng-pluralize';

@Component({
  selector:    'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ]
})
export class AppComponent {
  title = 'ng-pluralize-demo';

  public count:number = 1;
  public word:string = '';
  public word2:string = '';

  constructor(
    private service:NgPluralizeService
  ) {

  }

  goToGitHub():void {
    window.location.href = 'https://github.com/jrquick17/ng-pluralize';
  }

  isSingular(word:string):boolean {
    return this.service.isSingular(word);
  }

  fromCount():void {
    this.word2 = this.service.fromCount(this.word2, this.count, true);
  }

  update():void {
    if (this.isSingular(this.word)) {
      this.word = this.service.pluralize(this.word);
    } else {
      this.word = this.service.singularize(this.word);
    }
  }
}
