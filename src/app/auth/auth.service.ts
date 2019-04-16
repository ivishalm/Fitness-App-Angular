import { Subject } from 'rxjs/Subject';
import { User } from 'src/app/auth/user.model';
import { AuthData } from 'src/app/auth/auth-data.model';

export class AuthService {
    authChange = new Subject<boolean>();
    private user: User;


    registerUser(authData: AuthData) {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString()  
        };
    }

    login(authData: AuthData) {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString()  
        };
        this.authChange.next()
    }

    logout() {
        this.user = null;
    }


    getUser() {
        return {...this.user};
    }

    isAuth() {
        return this.user != null;
    }

}