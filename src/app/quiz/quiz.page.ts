import { Component, OnInit } from '@angular/core';
import { QuizServiceProxy, QuizDto } from 'src/shared/service-proxies/service-proxies';
import { ToastController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit {

  quizes: QuizDto[];
  constructor(
    private quizService: QuizServiceProxy,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    if (localStorage.quiz) {
      this.quizes = JSON.parse(localStorage.quiz) as QuizDto[];
    }
    if (navigator.onLine) {
      this.quizService.getMainSubjectQuiz()
    .subscribe(result => {
      this.quizes = result;
      localStorage.quiz = JSON.stringify(this.quizes);
    });
    } else {
      if (!localStorage.quiz) {
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
  }

  exitApp() {
    App.exitApp();
  }
}
