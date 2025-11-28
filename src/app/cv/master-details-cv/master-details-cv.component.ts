import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { Observable, catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { DefaultImagePipe } from '../pipes/default-image.pipe';

@Component({
  selector: 'app-master-details-cv',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, DefaultImagePipe],
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
