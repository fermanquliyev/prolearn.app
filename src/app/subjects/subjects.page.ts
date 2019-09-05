import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubjectServiceProxy, SubjectContainer } from 'src/shared/service-proxies/service-proxies';
import { AppConsts } from 'src/shared/AppConsts';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.page.html',
  styleUrls: ['./subjects.page.scss'],
})
export class SubjectsPage implements OnInit, OnDestroy {

  subject: SubjectContainer;
  baseApiUrl: string;
  onLine = true;
  photo: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private subjectService: SubjectServiceProxy,
    private http: HttpClient,
    public toastController: ToastController
  ) {
    this.baseApiUrl = AppConsts.baseServiceUrl;
    this.onLine = navigator.onLine;
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('msId');
      if (localStorage.getItem('subjects/' + id)) {
        this.subject = JSON.parse(localStorage.getItem('subjects/' + id)) as SubjectContainer;
      }
      if (this.onLine) {
        this.subjectService.getAllSubjectsMenu(id).subscribe(result => {
          this.subject = result.clone();
          localStorage.setItem('subjects/' + id, JSON.stringify(this.subject));
        });
      } else {
        if (!localStorage.getItem('subjects/' + id)) {
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
    }
    });
}

ngOnDestroy() {
}
}
