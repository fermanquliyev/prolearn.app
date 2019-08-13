import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubjectServiceProxy, SubjectContentDto } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-subject-content',
  templateUrl: './subject-content.page.html',
  styleUrls: ['./subject-content.page.scss'],
})
export class SubjectContentPage implements OnInit {

  mode: 'dark'|'light' = 'light';
  subjectContent: SubjectContentDto;
  constructor(
    private activeRoute: ActivatedRoute,
    private subjectService: SubjectServiceProxy
  ) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(params => {
      const id = +params.get('sId');
      this.subjectService.getSubjectContent(id).subscribe(result => {
          this.subjectContent = result;
          console.log(result);
          document.getElementById('subjectContent').innerHTML = result.content;
        });
    });
  }

  toggleMode(){
    if (this.mode === 'dark') {
      this.mode = 'light';
    } else {
      this.mode = 'dark';
    }
  }
}
