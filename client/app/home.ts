import {Component} from 'angular2/core';
import {AceEditor} from './ace';
import {UserService} from "./user.service";
import {ModuleService} from "./module.service";

@Component({
    selector: 'home',
    template: `
<div class="ui grid" *ngIf="isLoggedIn">
    <div class="row">
        <div class="four wide column">
            <div class="ui segment">
                <div class="ui list">
                    <div class="item">
                        <i class="folder icon"></i>
                        <div class="content">
                            <div class="header">public</div>
                            <div class="description">Your public EduCraft modules</div>
                            <div class="list">
                                <div class="item">
                                    <i class="file icon"></i>
                                    <div class="content">
                                        <div class="header">awesome-module</div>
                                        <div class="description">Updated 21 mins ago</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="twelve wide column">
            <div class="ui segments">
                <div class="ui clearing segment">
                    <div class="ui fluid labeled action input">
                        <div class="ui basic label">
                            {{user.username}}/
                        </div>
                        <input type="text" placeholder="module-name" [(ngModel)]="moduleName">
                        <div class="ui icon button" (click)="save()">
                            <i class="ui save icon"></i>
                        </div>
                    </div>
                </div>
                <div class="ui segment">
                    <div ace-editor (contentChange)="moduleCode=$event"></div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="ui middle aligned center aligned grid" *ngIf="!isLoggedIn">
  <div class="column" style="max-width:400px;padding-top:100px;">
    <h2 class="ui header">
      <div class="content">
        Log-in to your account
      </div>
    </h2>
    <form class="ui large form">
      <div class="ui stacked segment">
        <div class="ui fluid large dark blue basic button" (click)="login('craftenforum')">Login via Craften Forum</div>
      </div>

      <div class="ui error message"></div>

    </form>

    <div class="ui message">
      New here? <a href="https://forum.craften.de" target="_blank">Sign Up</a>
    </div>
  </div>
</div>
`,
    directives: [AceEditor],
})
export class Home {
    public isLoggedIn:boolean = false;
    public user;
    public moduleName:string = '';
    public moduleCode:string = '';

    constructor(private _userService:UserService, private _moduleService:ModuleService) {
        _userService.getUser().subscribe(user => {
            this.user = user;
            this.isLoggedIn = user != null
        });
    }

    login(provider:string) {
        location.href = '/auth/' + provider;
    }

    save() {
        if (/[0-9A-Za-z\-]+/.test(this.moduleName)) {
            this._moduleService.createModule(this.moduleName, this.moduleCode).subscribe(() => alert('Saved!'));
        } else {
            alert('Only alphanumeric characters are allowed for the module name.');
        }
    }
}