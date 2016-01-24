import {Injectable,Inject} from 'angular2/core'
import {HTTP_PROVIDERS, Http} from 'angular2/http'
import 'rxjs/operator/map';

@Injectable()
export class UserService {
    constructor(private _http:Http) {
    }

    getUser() {
        return this._http.get('/api/me').map(user => user.json());
    }

    logout() {
        return this._http.post('/logout', '');
    }
}