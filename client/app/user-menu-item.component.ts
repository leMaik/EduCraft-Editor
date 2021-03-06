import {Component} from 'angular2/core'
import {UserService} from './user.service'

@Component({
    selector: 'user-menu-item',
    inputs: ['user'],
    template: `
<div class="vertically fitted item" *ngIf="user">
    <img class="ui small avatar image" src="/api/me/avatar" style="width:1.5em;height:1.5em">
    {{user.username}}
</div>

<a class="vertically fitted icon item" (click)="logout()" *ngIf="user" title="Sign out">
    <i class="sign out icon"></i>
</a>
`,
    providers: [UserService]
})
export class UserMenuItemComponent {
    public user:{username: string};

    constructor(private _users:UserService) {
    }

    logout() {
        this._users.logout().subscribe(() => location.href = '/');
    }
}