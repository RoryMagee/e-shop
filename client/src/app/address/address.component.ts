import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  btnDisabled = false;
  currentAddress: any;
  constructor(private data: DataService, private rest: RestApiService) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get('http://localhost:8081/api/accounts/address');
      if(JSON.stringify(data['address']) === '{}' && this.data.message === '') {
        this.data.warning('You have not entered a shipping address');
      }
      //this.currentAddress = Object.assign(this.data.user.address);
      this.currentAddress = data['address'];
    } catch (error) {
      this.data.error(error);
    }
  }

  validate(address) {
    if(address.addr1) {
      if(address.addr2) {
        if(address.city) {
          if(address.state) {
            if(address.country) {
              if(address.postalCode) {
                return true;
              } else {
                this.data.error("Postalcode is missing");
              }
            } else {
              this.data.error("Country is missing");
            }
          } else {
            this.data.error("State is missing");
          }
        } else {
          this.data.error("City is missing");
        }
      } else {
        this.data.error("Address line 2 is missing");
      }
    } else {
      this.data.error("Address line 1 is missing");
    }
  }

  async update() {
    this.btnDisabled = true;
    try {
      if(this.validate(this.currentAddress)) {
        const data = await this.rest.post(
          'http://localhost:8081/api/accounts/address',
          {
            addr1: this.currentAddress['addr1'],
            addr2: this.currentAddress['addr2'],
            city: this.currentAddress['city'],
            state: this.currentAddress['state'],
            country: this.currentAddress['country'],
            postalCode: this.currentAddress['postalCode']
          }
        );
        data['success'] ? (this.data.getProfile(), this.data.success(data['message'])) : this.data.error(data['message']);
      }
    } catch (error) {
      this.data.error(error['message']);
      this.btnDisabled = false;
    }
  }

}
