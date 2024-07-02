import {Component, OnInit} from '@angular/core';
import { AuthService } from '@services/login/auth.service';
import {DateTime} from 'luxon';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    public user: any;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        // this.user = this.authService.user;
    }

    logout() {
        this.authService.logout();
    }

    formatDate(date) {
        return DateTime.fromISO(date).toFormat('dd LLL yyyy');
    }
}
