import { Component, OnInit } from '@angular/core';
import { FeedbackServiceProxy, InsertFeedbackInput } from 'src/shared/service-proxies/service-proxies';
import { Plugins } from '@capacitor/core';
import { AlertController, NavController } from '@ionic/angular';

const { Device } = Plugins;
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  input: InsertFeedbackInput;
  constructor(
    private feedbackService: FeedbackServiceProxy,
    private alertCtlr: AlertController,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    this.input = new InsertFeedbackInput();
    const info = await Device.getInfo();
    this.input.deviceInfo = JSON.stringify(info);
  }

  async send() {
    this.feedbackService.createFeedback(this.input)
    .subscribe(async (result) => {
      const alert = await this.alertCtlr.create({
        message: 'Mesajınız göndərildi!</br>Geri bildirim göndərdiyiniz üçün təşəkkür edirik!',
        buttons: [
          {
            text: 'Anladım',
            role: 'cancel',
            handler: async () => {
              await alert.dismiss();
              this.navCtrl.navigateRoot('');
            }
          }
        ]
      });
      await alert.present();
    });
  }
}
