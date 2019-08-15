import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/shared/AppConsts';
import { MainSubjectMenuDto, MainSubjectServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { Plugins } from '@capacitor/core';
import { ToastController } from '@ionic/angular';

const { App } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  baseServiceUrl: string;
  mainSubjects: MainSubjectMenuDto[] = [];
  active = false;
  constructor(
    private http: HttpClient,
    private mainSubService: MainSubjectServiceProxy,
    public toastController: ToastController
  ) {
    this.baseServiceUrl = AppConsts.baseServiceUrl;
  }

  ngOnInit() {
    if (navigator.onLine) {
      this.mainSubService.getMainSubjects().subscribe(result => {
        this.mainSubjects = result;
        this.mainSubjects.forEach(element => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => {
          const reader = new FileReader();
          reader.onloadend = () => {
              element.photoUrl = reader.result.toString();
              this.active = true;
          };
          reader.readAsDataURL(xhr.response);
          };
          xhr.open('GET', this.baseServiceUrl + '/api/File/GetImageFromPath?imagePath=' + element.photoUrl);
          xhr.responseType = 'blob';
          xhr.send();
        });
        setTimeout(() => {
          localStorage.mainSubjects = JSON.stringify(this.mainSubjects);
        }, 1000);
      });
    } else {
      if (localStorage.mainSubjects) {
        this.mainSubjects = JSON.parse(localStorage.mainSubjects) as MainSubjectMenuDto[];
      } else {
         this.toastController.create({
          message: 'Lokal data və internet bağlantısı mövcud deyil',
          position: 'bottom',
        }).then(toast => {
          toast.present();
        });
      }
      this.active = true;
    }
  }

  exitApp() {
    App.exitApp();
  }
}
