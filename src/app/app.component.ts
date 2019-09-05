import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async about() {
    const html = `<p>
    Layihə rəhbəri və proqramist</br> <a href='https://www.facebook.com/quliyevferman'>Fərman Quliyev</a>
    </br>
    </br>
    Dizayner</br> <a href='https://www.facebook.com/nemowil'>Xaliq Heydərov</a>
    </br>
    </br>
    Editor</br> <a href='https://www.facebook.com/Zahir.Mirzememmedli.05'>Zahir Mirzəməmmədli</a>
    </p>
    `;
    const alert = await this.alertCtrl.create({
      message: html,
      cssClass: 'text-center',
      buttons: [
        {
          text: 'Anladım',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

}
