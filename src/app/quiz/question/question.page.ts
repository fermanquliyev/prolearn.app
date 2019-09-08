import { Component, OnInit, ViewChild } from '@angular/core';
import { QuizServiceProxy, QuestionModel } from 'src/shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { ToastController, AlertController, NavController, IonRadioGroup } from '@ionic/angular';
import * as moment from 'moment';
import { TouchSequence } from 'selenium-webdriver';
@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit {

  index: number;
  questions: QuestionModel[];
  currentQuestion: QuestionModel;
  image: HTMLElement;
  time: moment.Duration = moment.duration();
  stopTime: boolean;
  @ViewChild('ionRadioGroup', {static: false}) ionRadioGroup: IonRadioGroup;
  constructor(
    private quizService: QuizServiceProxy,
    private activeRoute: ActivatedRoute,
    private toastController: ToastController,
    private alertController: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.index = 0;
    this.activeRoute.paramMap.subscribe(params => {
      const id = +params.get('msId');
      if (localStorage.getItem('quiz/' + id)) {
        this.questions = JSON.parse(localStorage.getItem('quiz/' + id)) as QuestionModel[];
        this.getQuestion();
      }
      if (navigator.onLine) {
        this.quizService.getQuestions(id).subscribe(result => {
          this.questions = result;
          this.getQuestion();
          localStorage.setItem('quiz/' + id, JSON.stringify(result));
        });
      } else {
        if (!localStorage.getItem('quiz/' + id)) {
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

  ionViewDidEnter() {
    this.time = moment.duration(this.questions.length * 60000);
    this.stopTime = false;
    this.timer();
  }

  ionViewWillLeave() {
    this.stopTime = true;
  }

  timer() {
    setTimeout(() => {
      this.time = this.time.subtract(1, 'seconds');
      if (this.stopTime) {
        return;
      }
      if (this.time.asSeconds() === 0) {
        this.checkAnswer();
      } else {
        this.timer();
      }
    }, 1000);
  }

  getQuestion() {
    if (this.ionRadioGroup) {
      this.ionRadioGroup.value = -1;
    }
    this.currentQuestion = this.questions[this.index];
  }

  nextQuestion() {
    if (this.index + 1 < this.questions.length) {
      this.index++;
      this.getQuestion();
    }
  }

  prevQuestion() {
    if (this.index - 1 >= 0) {
      this.index--;
      this.getQuestion();
    }
  }

  async checkAnswer() {
    const wrongAnsweredQuestions = this.questions.filter(x => x.answers.filter(y => y.isCorrect !== y.selected).length > 0);
    const alertHeader = `${this.questions.length} sual, ${this.questions.length - wrongAnsweredQuestions.length} doğru, ${wrongAnsweredQuestions.length} yanlış`;
    let alertMessage = '<div style="border:1px solid;">';
    wrongAnsweredQuestions.forEach((question, index) => {
      alertMessage += `<p> ${index + 1}: ${this.encode(question.questionDescription)}
      <br>
      Sizin cavab: ${question.answers.filter(x => x.selected).map(x => x.answerText).reduce((a, b) => a + ', ' + b, '')}
      <br>
      Doğru cavab: ${question.answers.filter(x => x.isCorrect).map(x => x.answerText).reduce((a, b) => a + ', ' + b)}
      <br>
      İzah: ${question.correctAnswerDescription !== null ? question.correctAnswerDescription : question.answers.filter(x => x.isCorrect).map(x => x.answerText).reduce((a, b) => a + ', ' + b)}
      </p>`;
    });
    alertMessage += '</div>';
    const alert = await this.alertController.create({
      header: alertHeader,
      message: alertMessage,
      animated: true,
      cssClass: 'width100',
    });
    await alert.present();
    alert.onDidDismiss().then(result => this.back());
  }

  radioChange(event) {
    if (event.detail.value >= 0) {
      this.currentQuestion.answers.forEach(a => a.selected = false);
      this.currentQuestion.answers[event.detail.value].selected = true;
      console.table(this.currentQuestion.answers);
    }
  }

  encode(text: string) {
    return text.replace(/[&<>]/g, this.replaceTag);
  }

  replaceTag(tag) {
    const tagsToReplace = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };
    return tagsToReplace[tag] || tag;
  }

  back() {
    this.navCtrl.back();
  }
}
