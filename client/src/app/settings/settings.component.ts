import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  btnDisabled = false;
  currentSettings: any;
  constructor(private data: DataService, private rest: RestApiService) { }

  async ngOnInit() {
    try {
      if(!this.data.user) {
        await this.data.getProfile();
      } 
      this.currentSettings = Object.assign({
        newPwd: '',
        pwdConfirm: ''
      }, this.data.user);
    } catch (error) {
      this.data.error(error);
    }
  }

  validate(settings) {
    if(settings['name']) {
      if(settings['email']) {
        if(settings['newPwd']) {
          if(settings['pwdConfirm']) {
            if(settings['newPwd'] === settings['pwdConfirm']) {
              return true;
            } else {
              this.data.error("Passwords do not match.")
            }
          } else {
            this.data.error("Please enter confirmation password.");
          }
        } else {
          this.data.error("Please enter your new password.");
        }
      } else {
        this.data.error("Please enter your email.");
      }
    } else {
      this.data.error("Please enter your name.");
    }
  }
  async update() {
    this.btnDisabled = true;
  }

}
