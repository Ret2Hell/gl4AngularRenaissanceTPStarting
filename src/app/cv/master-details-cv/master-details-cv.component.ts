import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { Observable, catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-master-details-cv',
  templateUrl: './master-details-cv.component.html',
  styleUrls: ['./master-details-cv.component.css']
})
export class MasterDetailsCvComponent implements OnInit {
  cvs$!: Observable<Cv[]>;

  constructor(
    private cvService: CvService,
    private toastr: ToastrService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.cvs$ = this.cvService.getCvs().pipe(
      catchError(() => {
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
        return of(this.cvService.getFakeCvs());
      })
    );
  }
}
