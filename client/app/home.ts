import {Component} from 'angular2/core';
import {UserService} from "./user.service";
import {ModuleService} from "./module.service";
import {ModuleEditor} from "./module-editor.component";
import {Module} from "./module";
import {BlocklyEditor} from "./blockly-editor.component";
import {BlocklyModule} from "./module";

@Component({
    selector: 'home',
    styles: [`
.list .active.item {
    color: #2185d0!important;
}

.modules {
    padding: 0;
}

.modules .item {
    padding: 1rem;
}

.ui.grid {
    height: calc(100% - 40px);
}

.ui.grid .row {
    padding-bottom: 0;
    height: 100%;
}

.editor {
    height: calc(100% - 2rem + 2px);
}
`],
    template: `
<div class="ui grid" *ngIf="isLoggedIn">
    <div class="row">
        <div class="four wide column">
            <div class="ui fluid blue basic button" (click)="newModule()">
                <i class="ui edit icon"></i>
                New module&hellip;
            </div>
            <div style="margin-top:1rem">
                <h5 class="ui top attached header">
                    Modules
                </h5>
                <div class="ui bottom attached segment modules">
                    <div class="ui center aligned basic segment" *ngIf="modules.length==0">
                        Use the editor to create your very first module.
                    </div>
                    <div class="ui list" *ngIf="modules.length>0">
                        <div class="item" *ngFor="#m of modules" (click)="module=m" style="cursor:pointer" [ngClass]="{active: m==module}">
                            <i class="code icon"></i>
                            <div class="content">{{m.name}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="twelve wide column">
            <div class="editor">
                <module-editor *ngIf="!isBlocklyModule()" [module]="module" (moduleSaved)="saveModule($event)"></module-editor>
                <blockly-editor *ngIf="isBlocklyModule()" [module]="module" (moduleSaved)="saveBlocklyModule($event)"></blockly-editor>
            </div>
            <button class="ui basic mini button" *ngIf="module!=null" (click)="openRawModule()">
            <i class="ui text file outline icon"></i>
                Open raw file
            </button>
            <button class="ui red basic right floated mini button" *ngIf="module!=null" (click)="deleteModule()">
                Delete module
            </button>
        </div>
    </div>
</div>
<div class="ui center aligned grid" *ngIf="!isLoggedIn">
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
    directives: [ModuleEditor, BlocklyEditor],
})
export class Home {
    public isLoggedIn:boolean = false;
    public user;
    public modules:Module[] = [];
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
                this.modules.push(module);
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

    saveBlocklyModule(module:BlocklyModule) {
        if (this.module == null) {
            this._moduleService.createBlocklyModule(module.name, module.code, module.blockly).subscribe(module => {
                this.modules.push(module);
                this.module = module;
            });
        } else {
            this._moduleService.updateBlocklyModule(this.module.name, module.name, module.code, module.blockly).subscribe(module => {
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

    openRawModule() {
        if (this.module != null) {
            window.open('/modules/' + this.user.username + '/' + this.module.name);
        }
    }

    isBlocklyModule() {
        return this.module == null || (<BlocklyModule>this.module).blockly;
    }
}