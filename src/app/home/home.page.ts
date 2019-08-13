import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/shared/AppConsts';
import { MainSubjectMenuDto, MainSubjectServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { Plugins } from '@capacitor/core';

const { App } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  baseServiceUrl: string;
  mainSubjects: MainSubjectMenuDto[] = [];
  constructor(
    private http: HttpClient,
    private mainSubService: MainSubjectServiceProxy
  ) {
    this.baseServiceUrl = AppConsts.baseServiceUrl;
  }

  ngOnInit() {
    this.mainSubService.getMainSubjects().subscribe(result=>{
      this.mainSubjects = result;
      console.log(result);
    });
  }

  exitApp() {
    App.exitApp();
  }
}
