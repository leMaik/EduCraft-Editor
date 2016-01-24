import {Injectable,Inject} from 'angular2/core'
import {HTTP_PROVIDERS, Http, Headers} from 'angular2/http'
import {Observable} from 'rxjs';
import 'rxjs/operator/map';

@Injectable()
export class ModuleService {
    constructor(private _http:Http) {
    }

    getModules() {
        return this._http.get('/api/modules').map(modules => modules.json());
    }

    createModule(module:string, code:string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post('/api/modules', JSON.stringify({name: module, code: code}), {
            headers: headers
        }).map(module => module.json());
    }

    updateModule(existingModule:string, module:string, code:string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.put('/api/modules/' + existingModule, JSON.stringify({name: module, code: code}), {
            headers: headers
        }).map(module => module.json());
    }

    deleteModule(module:string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.delete('/api/modules/' + module, {
            headers: headers
        });
    }
}