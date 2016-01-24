import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {UserMenuItemComponent} from './user-menu-item.component';
import {UserService} from './user.service';
import {Home} from './home';
import {Login} from './login';
import {ModuleService} from "./module.service";

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
    providers: [UserService, ModuleService]
})
@RouteConfig([
    {path: '/', component: Home},
    {path: '/login', component: Login}
])
export class AppComponent {
    public user;

    constructor(private _userService:UserService) {
        _userService.getUser().subscribe(user => this.user = user);
    }
}