import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  btnDisabled = false;
  handler: any;
  quantities = [];
  constructor(private data: DataService, private rest: RestApiService, private router: Router) {

  }

  trackByCartItems(index: number, item: any) {
    return item._id;
  }

  get cartItems() {
    return this.data.getCart();
  }

  get cartTotal() {
    let total = 0;
    this.cartItems.forEach((data, index) => {
      total += data['price'] * this.quantities[index];
    });
    return total;
  }

  removeProduct(index, product) {
    this.quantities.splice(index, 1);
    this.data.removeFromCart(product);
  }

  ngOnInit() {
    this.cartItems.forEach(data => {
      this.quantities.push(1);
    });
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      locale: 'auto',
      token: async stripeToken => {
        let products;
        products = [];
        this.cartItems.forEach((d, index) => {
          products.push({
            product: d['_id'],
            quantity: this.quantities[index]
          });
        });
        try {
          const data = await this.rest.post(
            environment.url + '/api/payment',
            {
              totalPrice: this.cartTotal,
              products,
              stripeToken
            }
          );
          data['success'] ? (this.data.clearCart(), this.data.success('Purchase Successful')) : this.data.error(data['message']);
        } catch (error) {
          this.data.error(error['message']);
        }
      }
    });
  }

  validate() {
    if(!localStorage.getItem('token')) {
      console.log("no token");
      this.router.navigate(['/login']).then(() => {
        this.data.warning('You must be logged in to make a purchase');
      }) 
    } else {
      return true;
    }
    // console.log("validating");
    // if(!this.quantities.every(data => data > 0)) {
    //   this.data.warning('Quantity must be more than zero');
    //   console.log("quantity less than zero");
    // } else if (!localStorage.getItem('token')) {
    //   console.log("token invisible");
    //   this.router.navigate(['/login'])
    //   .then(() => {
    //     this.data.warning('You must be logged in to make a purchase');
    //   });
    // } else if (!this.data.user('address')) {
    //   console.log("no address");
    //   this.router.navigate(['/profile/address'])
    //   .then(()=> {
    //     this.data.warning('No shipping address on record');
    //   });
    // } else {
    //   console.log("validated");
    //   this.data.message = '';
    //   return true;
    // }
  }

  checkout() {
    this.btnDisabled = true;
    try {
      if(this.validate()) {
        this.handler.open({
          name: 'E-Shop',
          description: 'checkout payment',
          amount: this.cartTotal * 100,
          closed: () => {
            this.btnDisabled = false;
          }
        });
      } else {
        this.btnDisabled = false;
      }
    } catch (error) {

    }
  }
}
