import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productId: any;
  product: any;

  constructor(private rest: RestApiService, private data: DataService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res=> {
      this.productId = res['id'];
      this.getProduct();
    })
  }

  async getProduct(event ?: any) {
    if(event) {
      this.product = null;
    }
    try {
      const data = await this.rest.get(
        environment.url + '/api/products/' + this.productId
      );
      data['success'] ? (this.product = data['product']) : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  addToCart() {
    this.data.addToCart(this.product) ? this.data.success('Product added to Cart') : this.data.error('Product has already been added to Cart');
  }

}
