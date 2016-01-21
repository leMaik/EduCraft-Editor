import {Injectable,Inject} from 'angular2/core'
import {HTTP_PROVIDERS, Http} from 'angular2/http'

@Injectable()
export class UserService {
    constructor(private _http:Http) {
    }

    getUser() {
        return this._http.get('/api/me');
    }

    logout() {
        return this._http.post('/logout', '').subscribe(() => alert('hi'));
    }
}