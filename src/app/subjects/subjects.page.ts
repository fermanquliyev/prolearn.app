import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubjectServiceProxy, SubjectContainer } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.page.html',
  styleUrls: ['./subjects.page.scss'],
})
export class SubjectsPage implements OnInit {

  subject: SubjectContainer;
  constructor(
    private activatedRoute: ActivatedRoute,
    private subjectService: SubjectServiceProxy
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('msId');
      this.subjectService.getAllSubjectsMenu(id).subscribe(result => {
        this.subject = result;
      });
    });
  }

}
