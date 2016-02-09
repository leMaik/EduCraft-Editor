import {Component, EventEmitter, Output, Input, OnInit} from 'angular2/core';
import {AceEditor} from './ace';
import {UserService} from "./user.service";
import {BlocklyModule} from "./module";
import {BlocklyArea} from "./blockly/blockly";

const DEFAULT_PROGRAM = '<xml><block type="program_base" deletable="false" movable="false"></block></xml>';

@Component({
    selector: 'blockly-editor',
    inputs: ['module'],
    styles: [`
.ui.tab.editor {
    height: calc(100% - 11.5rem - 6px);
}

[ace-editor] {
    width: 100%;
    height: 100%;
}
`],
    template: `
<div class="ui piled segments">
    <div class="ui clearing segment">
        <div class="ui fluid labeled action input">
            <div class="ui basic label">
                {{user.username}}/
            </div>
            <input type="text" placeholder="module-name" [(ngModel)]="name">
            <div class="ui icon button" (click)="save()" [ngClass]="{disabled: !modified}">
                <i class="ui save icon"></i>
            </div>
        </div>
    </div>
    <div class="ui segment">
        <div class="ui tabular menu">
            <div class="item" data-tab="tab-name">Blockly</div>
            <div class="item" data-tab="tab-name2">Code</div>
        </div>
        <div class="ui tab" data-tab="tab-name">
            <blockly-area (codeChange)="code=$event.code;blockly=$event.source" [source]="initialBlockly"></blockly-area>
        </div>
        <div class="ui tab editor" data-tab="tab-name2">
            <div ace-editor [content]="code" [readOnly]="true"></div>
        </div>
    </div>
</div>
`,
    directives: [AceEditor, BlocklyArea],
})
export class BlocklyEditor implements OnInit {
    public user = {};
    private initialName:string;
    private initialBlockly:string = DEFAULT_PROGRAM;
    private name:string;
    private code:string = '';
    private blockly:string = DEFAULT_PROGRAM;
    @Output() moduleSaved:EventEmitter<BlocklyModule> = new EventEmitter();

    constructor(private _userService:UserService) {
        _userService.getUser().subscribe(user => {
            this.user = user;
        });
    }

    ngOnInit() {
        $('.tabular.menu .item').tab();
    }

    save() {
        if (/[0-9A-Za-z\-]+/.test(this.name)) {
            this.moduleSaved.emit({name: this.name, code: this.code, blockly: this.blockly});
            this.initialName = this.name;
            this.initialBlockly = this.blockly;
        } else {
            alert('Only alphanumeric characters are allowed for the module name.');
        }
    }

    set module(module:BlocklyModule) {
        this.initialName = module != null ? module.name : '';
        this.initialBlockly = module != null ? module.blockly : DEFAULT_PROGRAM;
        this.name = this.initialName;
        this.blockly = this.initialBlockly;
        this.code = module != null ? module.code : '';
    }

    get modified() {
        return this.blockly != this.initialBlockly || this.name != this.initialName;
    }
}