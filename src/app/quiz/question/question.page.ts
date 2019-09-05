import { Component, OnInit } from '@angular/core';
import { QuizServiceProxy, QuestionModel } from 'src/shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
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
  constructor(
    private quizService: QuizServiceProxy,
    private activeRoute: ActivatedRoute,
    private toastController: ToastController,
    private alertController: AlertController
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

  getQuestion() {
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

  checkAnswer() {
    const length = this.currentQuestion.answers.filter(x => x.isCorrect !== x.selected).length;
    if (length === 0) {
      this.alertController.create({
        header: 'Cavabınız doğrudur!',
        message: this.currentQuestion.correctAnswerDescription,
        animated: true
      }).then(alert => alert.present());
    } else {
      this.alertController.create({
        header: 'Cavabınız yanlışdır!',
        message: this.currentQuestion.correctAnswerDescription,
        animated: true
      }).then(alert => alert.present());
    }
  }

  radioChange(event) {
    this.currentQuestion.answers.forEach(a => a.selected = false);
    if (event.detail.value >= 0) {
      this.currentQuestion.answers[event.detail.value].selected = true;
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
}
