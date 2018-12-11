import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {
  myProducts: any;

  constructor(private data: DataService, private rest: RestApiService) {

  }

  async ngOnInit() {
    try {
      const data = await this.rest.get('http://shop.snspbvwdfe.eu-west-1.elasticbeanstalk.com/api/seller/products');
      data['success'] ? (this.myProducts = data['products']) : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

}
