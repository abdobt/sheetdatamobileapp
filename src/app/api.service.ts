/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Workbook} from "exceljs/dist/exceljs.min.js";
import * as FileSaver from 'file-saver';
import {File} from '@ionic-native/file/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ToastController } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient,private f: File,public toastController: ToastController,private fo: FileOpener) { }
  public getdata(index,dt)
  {
    const person = new Person();
    person.index = index;
    person.dt = dt;
return this.http.post('http://192.168.1.108:5000/',person);
  }
  async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const header = ['','Long','Short','Spreads','Long','Short','Long','Short','Long','Short'];
    const data = json;
    //Create workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(excelFileName);
    //Add Header Row
    worksheet.getCell('A1').value = 'Date';
    worksheet.mergeCells('B1', 'C1');
  //  worksheet.mergeCells('C1','D1');
    worksheet.getCell('C1').value = 'Non-commercialst';
    worksheet.mergeCells('E1','F1');
    worksheet.getCell('E1').value = 'Commercials';
    worksheet.mergeCells('G1','H1');
    worksheet.getCell('G1').value = 'Total';
    worksheet.mergeCells('I1','J1');
    worksheet.getCell('I1').value = ' Non-reportable';
    const headerRow = worksheet.addRow(header);
    // Cell Style : Fill and Border
    // eslint-disable-next-line id-blacklist
    headerRow.eachCell((cell, number) => {
      cell.alignment={horizontal:'center'};
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    });
    worksheet.mergeCells('A1', 'A2');
    // Add Data and Conditional Formatting
   data.forEach((element) => {
     worksheet.addRow(element);
    });
    worksheet.getColumn(1).alignment={horizontal:'center'};
    worksheet.getColumn(2).alignment={horizontal:'center'};
    worksheet.getColumn(3).alignment={horizontal:'center'};
    worksheet.getColumn(4).alignment={horizontal:'center'};
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 30;
    worksheet.addRow([]);
    //Generate Excel File with given name
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const that=this;
    that.presentToast("file:"+this.f.dataDirectory);
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      that.presentToast(that.f.dataDirectory);
      that.f.writeFile(this.f.dataDirectory,"data.xlsx",data,{replace:true}).then(res=>
        {
that.presentToast(res.nativeURL);
this.fo.showOpenWithDialog(res.nativeURL, 'application/pdf')
  .then(() => console.log('File is opened'))
  .catch(e => console.log('Error opening file', e));
        });
      FileSaver.saveAs(blob, excelFileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
     FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }

}
class Person {
  index: string;
  dt: string;
}
