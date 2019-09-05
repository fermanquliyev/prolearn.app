import { Component, OnInit } from '@angular/core';
import { MainSubjectMenuDto, MainSubjectServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { Plugins, Toast } from '@capacitor/core';
import { ToastController } from '@ionic/angular';

const { App } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mainSubjects: MainSubjectMenuDto[] = [];
  active = false;
  constructor(
    private mainSubService: MainSubjectServiceProxy,
    public toastController: ToastController
  ) {
  }

  ngOnInit() {
    if (localStorage.mainSubjects) {
      this.mainSubjects = JSON.parse(localStorage.mainSubjects) as MainSubjectMenuDto[];
    }
    if (navigator.onLine) {
      this.mainSubService.getMainSubjects().subscribe(result => {
        this.mainSubjects = result;
        localStorage.mainSubjects = JSON.stringify(this.mainSubjects);
      });
      // this.showBanner();
    } else {
      if (!localStorage.mainSubjects) {
         this.toastController.create({
          message: 'Lokal data və internet bağlantısı mövcud deyil',
          position: 'bottom',
          buttons: [
             {
              text: 'Anladım',
              role: 'cancel',
            }
          ]
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
