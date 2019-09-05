import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubjectServiceProxy, SubjectContentDto, SubjectInfoDto } from 'src/shared/service-proxies/service-proxies';
import { AlertController, ToastController } from '@ionic/angular';
import * as PinchZoom from 'pinch-zoom-js';
@Component({
  selector: 'app-subject-content',
  templateUrl: './subject-content.page.html',
  styleUrls: ['./subject-content.page.scss'],
})
export class SubjectContentPage implements OnInit {

  mode: 'dark'|'light' = 'light';
  subjectInfo: SubjectInfoDto;
  subjectContent: SubjectContentDto;
  modal: HTMLElement;
  modalImg: any;
  captionText: HTMLElement;
  id: number;
  constructor(
    private activeRoute: ActivatedRoute,
    private subjectService: SubjectServiceProxy,
    private alertCtrl: AlertController,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(params => {
      const id = +params.get('sId');
      this.id = id;
      if (navigator.onLine) {
        this.subjectService.getSubjectContent(id).subscribe(result => {
          this.subjectContent = result;
          document.getElementById('subjectContent').innerHTML = result.content;
          this.imagePopup();
          if (localStorage.mode) {
            this.mode = localStorage.mode;
          }
          this.subjectContent.content = document.getElementById('subjectContent').innerHTML;
          localStorage.setItem('content/' + id, JSON.stringify(this.subjectContent));
        });
      } else {
        if (localStorage.getItem('content/' + id)) {
          this.subjectContent = JSON.parse(localStorage.getItem('content/' + id)) as SubjectContentDto;
          document.getElementById('subjectContent').innerHTML = this.subjectContent.content;
          this.imagePopup();
          if (localStorage.mode) {
            this.mode = localStorage.mode;
          }
        } else {
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

  imagePopup() {
    this.modal = document.getElementById('myModal');
    this.modalImg = document.getElementById('img01');
    this.captionText = document.getElementById('caption');
    const images = document.querySelectorAll('#subjectContent img');
    const self = this;
    images.forEach(image => {
      image.addEventListener('click', function() {
        self.modal.style.display = 'block';
        self.modalImg.src = this.src;
        self.captionText.innerHTML = this.alt;
      });
    });
    const zoom = new PinchZoom.default(this.modalImg);
  }

  toggleMode() {
    if (this.mode === 'dark') {
      this.mode = 'light';
    } else {
      this.mode = 'dark';
    }
    localStorage.mode = this.mode;
  }

  showInfo() {
    if (this.subjectInfo) {
      this.showInfoAlert(this.subjectInfo);
    } else {
      this.subjectService.getSubjectInfo(this.subjectContent.id)
      .subscribe(result => {
        this.subjectInfo = result;
        this.showInfoAlert(this.subjectInfo);
      });
    }
  }
  async showInfoAlert(info: SubjectInfoDto) {
    const alertMessage = `<p>Yazar: ${info.user.name} ${info.user.surname} (${info.user.email})</p>
    <p> Oxunma sayı: ${info.subjectReadCount}<p>`;
    const alert = await this.alertCtrl.create({
      header: this.subjectContent.subjectName,
      message: alertMessage,
      buttons: ['OK']
    });

    await alert.present();
  }
}
