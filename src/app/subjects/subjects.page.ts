import { Component, OnInit } from '@angular/core';
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
export class SubjectsPage implements OnInit {

  subject: SubjectContainer;
  baseApiUrl: string;
  active = false;
  photo: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private subjectService: SubjectServiceProxy,
    private http: HttpClient,
    public toastController: ToastController
  ) {
    this.baseApiUrl = AppConsts.baseServiceUrl;
   }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('msId');
      if (navigator.onLine) {
      this.subjectService.getAllSubjectsMenu(id).subscribe(result => {
        this.subject = result;
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          const reader = new FileReader();
          reader.onloadend = () => {
              this.subject.mainSubject.photoUrl = reader.result.toString();
              this.active = true;
          };
          reader.readAsDataURL(xhr.response);
          };
        xhr.open('GET', this.baseApiUrl + '/api/File/GetImageFromPath?imagePath=' + this.subject.mainSubject.photoUrl);
        xhr.responseType = 'blob';
        xhr.send();
        setTimeout(() => {
          localStorage.setItem('subjects/' + id, JSON.stringify(this.subject));
        }, 1000);
      }); } else {
        if (localStorage.getItem('subjects/' + id)) {
          this.subject = JSON.parse(localStorage.getItem('subjects/' + id)) as SubjectContainer;
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
    });
  }

}
