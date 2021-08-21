/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { ApiService } from '../api.service';
import {File} from '@ionic-native/file/ngx';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  a=0;
  dt=[];
  constructor(private service: ApiService,private file: File) {
   }

  ngOnInit() {}
submit()
{
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  this.dt.forEach(function(element, index, array){
    const format = 'MMddyy';
const locale = 'en-US';
array[index] = formatDate(element, format, locale);
});
  console.log(this.dt);
  const a=this;
  this.service.getdata(1,this.dt).subscribe(data => {
    console.log(data);
    a.generateexcel(data);
  },
  error => {
    console.error(error);
    throw error;
  });
}
generateexcel(e)
{
this.service.exportAsExcelFile(e, 'sample');
}
convertData(a) {
  const output = a.map(function(obj) {
    return Object.keys(obj).sort().map(function(key) {
      return obj[key];
    });
  });
}
}
