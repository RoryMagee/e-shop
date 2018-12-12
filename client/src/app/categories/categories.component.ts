import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any;
  newCategory = '';
  btnDisabled = false;
  constructor(private rest: RestApiService, private data: DataService) {

  }

  async ngOnInit() {
    try {
      const data = await this.rest.get(environment.url + '/api/categories');
      data['success'] ? (this.categories = data['categories']) : this.data.error(data['message'])
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async addCategory() {
    this.btnDisabled = true;
    try {
      const data = await this.rest.post(environment.url + '/api/categories',
      {
        category: this.newCategory
      });
      data['success'] ? this.data.success(data['message']) : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
    this.ngOnInit();
    this.btnDisabled = false;
  }

}
