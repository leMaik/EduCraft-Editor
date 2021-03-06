import {Component, ElementRef} from 'angular2/core';
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

svg {
    width: 24px;
    fill: white;
}
`],
    template: `
<div class="ui grid" *ngIf="isLoggedIn">
    <div class="row">
        <div class="four wide column">
            <div class="ui floating fluid blue basic dropdown button">
                <i class="ui write icon"></i>
                New module&hellip;

                <div class="menu">
                    <a class="item" (click)="newBlocklyModule()" data-content="Dive into the world of programming &ndash; without any code!" data-variation="inverted">
                        <i class="puzzle icon"></i> Blockly module
                    </a>
                    <a class="item" (click)="newModule()" data-content="Code powerful modules using Lua. Recommended for advanced users." data-variation="inverted">
                        <i class="code icon"></i> Lua module
                    </a>
                </div>
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
                            <i class="code icon" *ngIf="!m.blockly"></i>
                            <i class="puzzle icon" *ngIf="m.blockly"></i>
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
        <div class="ui fluid large dark blue button" (click)="login('craftenforum')">
            <i>
                <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 128 128" class="ui spaced image"><path d="M74.8 13L119 29.6v68.2L74.8 115z"/><path fill-rule="evenodd" d="M11.5 39.8l9.3-2v26H16v24.7l4.8 1V81l11 1.7v9.5l6.3 1.5V64h-6V35.4l13.5-3v21l-33.7 2.2zM65.8 0L0 24.4v78.3L65.8 128z"/></svg>
            </i>
            Login via Craften Forum
        </div>
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
    private isBlockly:boolean = true;

    constructor(private _userService:UserService, private _moduleService:ModuleService, private elementRef:ElementRef) {
        _userService.getUser().subscribe(user => {
            this.user = user;
            this.isLoggedIn = user != null;
            this.initView();
        });
        _moduleService.getModules().subscribe(modules => this.modules = modules);
    }

    login(provider:string) {
        location.href = '/auth/' + provider;
    }

    newModule() {
        this.module = null;
        this.isBlockly = false;
    }

    newBlocklyModule() {
        this.module = null;
        this.isBlockly = true;
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
            let blocklyModule = <BlocklyModule>this.module;
            this._moduleService.updateBlocklyModule(this.module.name, module.name, module.code, module.blockly).subscribe(module => {
                blocklyModule.name = module.name;
                blocklyModule.blockly = module.blockly;
                blocklyModule.code = module.code;
                blocklyModule.lastModified = module.lastModified;
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
        return (this.module == null && this.isBlockly) || (this.module != null && (<BlocklyModule>this.module).blockly);
    }

    private initView() {
        setTimeout(() => {
            $(this.elementRef.nativeElement).find('.ui.dropdown').dropdown({
                action: 'hide'
            });
            $(this.elementRef.nativeElement).find('[data-content]').popup();
        }, 100);
    }
}