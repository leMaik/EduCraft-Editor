import {Component} from 'angular2/core';
import {UserService} from "./user.service";
import {ModuleService} from "./module.service";
import {ModuleEditor} from "./module-editor.component";
import {Module} from "./module";

@Component({
    selector: 'home',
    template: `
<div class="ui grid" *ngIf="isLoggedIn">
    <div class="row">
        <div class="four wide column">
            <div class="ui segment">
                <div class="ui list">
                    <div class="item">
                        <i class="edit icon"></i>
                        <div class="content">
                            <a class="header" (click)="newModule()">New module&hellip;</a>
                        </div>
                    </div>
                    <div class="item" *ngFor="#m of modules">
                        <i class="file icon"></i>
                        <div class="content">
                            <a class="header" (click)="module=m">{{m.name}}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="twelve wide column">
            <module-editor [module]="module" (moduleSaved)="saveModule($event)"></module-editor>
            <button class="ui red basic right floated mini button" *ngIf="module!=null" (click)="deleteModule()" style="margin-top:1rem">
                Delete module
            </button>
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
    directives: [ModuleEditor],
})
export class Home {
    public isLoggedIn:boolean = false;
    public user;
    public modules:Module[];
    public module:Module;

    constructor(private _userService:UserService, private _moduleService:ModuleService) {
        _userService.getUser().subscribe(user => {
            this.user = user;
            this.isLoggedIn = user != null
        });
        _moduleService.getModules().subscribe(modules => this.modules = modules);
    }

    login(provider:string) {
        location.href = '/auth/' + provider;
    }

    newModule() {
        this.module = null;
    }

    saveModule(module:Module) {
        if (this.module == null) {
            this._moduleService.createModule(module.name, module.code).subscribe(module => {
                this.modules.push(module)
                this.module = module;
            });
        } else {
            this._moduleService.updateModule(this.module.name, module.name, module.code).subscribe(module => {
                this.module.name = module.name;
                this.module.code = module.code;
                this.module.lastModified = module.lastModified;
            });
        }
    }

    deleteModule() {
        if (this.module != null) {
            this._moduleService.deleteModule(this.module.name).subscribe(() => {
                this.modules = this.modules.filter(m => m.name != this.module.name);
                this.module = null;
            })
        }
    }
}