/* eslint-disable id-blacklist */
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
import { HomeComponent } from './home/home.component';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  fa: boolean;
  constructor(private http: HttpClient,private f: File,public toastController: ToastController
    ,private fo: FileOpener) {
      this.fa=false;
    }
  public getdata(index,dt)
  {
    const person = new Person();
    person.index = index;
    person.dt = dt;
    this.fa=true;
return this.http.post<any[]>('https://msheetapp.herokuapp.com/getdata',person);
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
    worksheet.getCell(`A1`).value = excelFileName; // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.
    worksheet.mergeCells('A1:J1'); // Extend cell over all column headers
    worksheet.getCell(`A1`).alignment = { horizontal: 'center' };
    worksheet.getCell('A2').value = 'Date';
    worksheet.mergeCells('B2:D2');
  //  worksheet.mergeCells('C1','D1');
    worksheet.getCell('C2').value = 'Non-commercialist';
    worksheet.mergeCells('E2','F2');
    worksheet.getCell('E2').value = 'Commercials';
    worksheet.mergeCells('G2','H2');
    worksheet.getCell('G2').value = 'Total';
    worksheet.mergeCells('I2','J2');
    worksheet.getCell('I2').value = ' Non-reportable';
    const headerRow = worksheet.addRow(header);
    worksheet.getCell('A2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '89CFF0' },
      bgColor: { argb: '89CFF0' }
    };
    worksheet.getCell('C2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4F7942' },
      bgColor: { argb: '4F7942' }
    };
    worksheet.getCell('E2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '0096FF' },
      bgColor: { argb: '0096FF' }
    };
    worksheet.getCell('G2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'DAF7A6 ' },
      bgColor: { argb: 'DAF7A6 ' }
    };
    worksheet.getCell('I2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'C70039 ' },
      bgColor: { argb: 'C70039 ' }
    };

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
    worksheet.mergeCells('A2', 'A3');
    worksheet.getCell('A1').alignment = { vertical:'center'} ;
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
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      that.f.writeFile(that.f.externalRootDirectory + '/Documents/',excelFileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
      ,blob,{replace:true}).then(res=>
        {
/*this.fo.showOpenWithDialog(res.nativeURL, 'application/xlsx')
  .then(() => console.log('File is opened'))
  .catch(e => console.log('Error opening file', e));*/
        },
        err =>{
this.presentToast("error"+err.message);
        }
        );
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
