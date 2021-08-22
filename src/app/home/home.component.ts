/* eslint-disable eqeqeq */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { ApiService } from '../api.service';
import {File} from '@ionic-native/file/ngx';
import { AlertController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  a=0;
  index=0;
  ldg=0;
  dt=[];
  names=[
    'CANADIAN DOLLAR - CHICAGO MERCANTILE EXCHANGE',
    'SWISS FRANC - CHICAGO MERCANTILE EXCHANGE',
    'MEXICAN PESO - CHICAGO MERCANTILE EXCHANGE',
    'BRITISH POUND STERL ING - CHICAGO MERCANTILE EXCHANGE',
    'JAPANESE YEN - CHICAGO MERCANTILE EXCHANGE',
    'EURO FX - CHICAGO MERCANTILE EXCHANGE',
    'NEW ZEALAND DOLLAR - CHICAGO MERCANT ILE EXCHANGE',
    'AUSTRALIAN DOLLAR - CHICAGO MERCANTILE EXCHANGE',
    'SILVER - COMMODITY EXCHANGE INC',
    'GOLD - COMMODITY EX CHANGE INC'
  ];
  constructor(public service: ApiService,private file: File,public toastController: ToastController
    ,public alertController: AlertController) {
   }
   async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 10000
    });
    toast.present();
  }
  async presentAlert(m,h,cc) {
    const alert = await this.alertController.create({
      cssClass: cc,
      header: h,
      message: m,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
  checkelementslength()
  {
    let a=true;
    for(const element of this.dt)
    {

      if(String(element).length!=6)
      {
        a= false;
        break;
      }
    }
    return a;
  }
  checkArray(){
    if(this.dt.length==0)
    {
      return false;
    }
    else if(this.dt.length!=this.a)
    {
      return false;
    }
    else
    {    return true;
    }

 }
  ngOnInit() {}
submit()
{
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  if(this.index==0)
  {
this.presentAlert('No index is selected','Error','my-custom-class');
  }
  else if(this.a==0){
  this.presentAlert('You have to enter at least one date','Error','my-custom-class');
  }
  else if(!this.checkArray())
  {
    this.presentAlert('You have to fill all the input elements','Error','my-custom-class');
  }
  else if(!this.checkelementslength())
  {
    this.presentAlert('All dates must have a length of 6','Error','my-custom-class');
  }
  else{
    const a=this;
    const b=this.dt;
    console.log(this.dt);
    console.log(b);
    this.service.getdata(this.index,this.dt).subscribe(data => {
      let l=-1;
      if(this.index == 1)
      {
        data.forEach(function(element, index, array){
      if(index%8==0) {
        l+=1;
      }
      const d = b[l].substring(0,2)+'-'+b[l].substring(2,4)+'-'+b[l].substring(4,6);
      array[index] = [d].concat(element);
      });
      for (let index = 0; index < 8; index++) {
        let r=index;
        const ar=new Array();
        while(r<data.length)
        {
          ar.push(data[r]);
          r+=8;
        }
      a.generateexcel(ar,this.names[index]);
      }
      }
      else if(this.index == 2)
      {
        data.forEach(function(element, index, array){
          const d = b[index].substring(0,2)+'-'+b[index].substring(2,4)+'-'+b[index].substring(4,6);
      array[index] = [d].concat(element);
      });
      a.generateexcel(data,'U.S. DOLLAR INDEX - ICE FUTURES U.S');
      }
      else{
        data.forEach(function(element, index, array){
      if(index%2==0) {
        l+=1;
      }
      const d = b[l].substring(0,2)+'-'+b[l].substring(2,4)+'-'+b[l].substring(4,6);
      array[index] = [d].concat(element);
      });
      for (let index = 0; index < 2; index++) {
        let r=index;
        const ar=new Array();
        while(r<data.length)
        {
          ar.push(data[r]);
          r+=2;
        }
      a.generateexcel(ar,this.names[8+index]);
      }
      }
      this.service.fa=false;
      this.presentAlert('All files has been downloaded','Congrats','danger');
    },
    err => {
      this.presentAlert('Check your internet connection and the validity of the dates you entered','Error','my-custom-class');
    });
  }
}
generateexcel(e,name)
{
  console.log('generating excel file');
this.service.exportAsExcelFile(e, name);
}
convertData(a) {
  const output = a.map(function(obj) {
    return Object.keys(obj).sort().map(function(key) {
      return obj[key];
    });
  });
}
}
