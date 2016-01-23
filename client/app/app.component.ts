import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {UserMenuItemComponent} from './user-menu-item.component';
import {UserService} from './user.service';
import {Home} from './home';
import {Login} from './login';

@Component({
    selector: 'educraft-editor',
    template: `
<div class="ui menu">
    <a class="active item">EduCraft</a>

    <user-menu-item [user]="user" class="right menu"></user-menu-item>
</div>
<router-outlet></router-outlet>
`,
    directives: [UserMenuItemComponent, ROUTER_DIRECTIVES],
    providers: [UserService]
})
@RouteConfig([
    {path: '/', component: Home},
    {path: '/login', component: Login}
])
export class AppComponent implements OnInit {
    public user = null;

    constructor(private _userService:UserService) {
    }

    ngOnInit() {
        this._userService.getUser().subscribe(user => this.user = user.json());
    }
}