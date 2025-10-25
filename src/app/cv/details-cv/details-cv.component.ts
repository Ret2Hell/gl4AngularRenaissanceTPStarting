import { Component, OnInit } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';
import { Observable, catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-details-cv',
  templateUrl: './details-cv.component.html',
  styleUrls: ['./details-cv.component.css'],
})
export class DetailsCvComponent implements OnInit {
  cv$!: Observable<Cv | null>;
  constructor(
    private cvService: CvService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // Use async pipe with proper error handling
    this.cv$ = this.activatedRoute.params.pipe(
      switchMap(params => {
        const id = +params['id'];
        return this.cvService.getCvById(id).pipe(
          catchError(() => {
            this.toastr.error('CV non trouvé');
            this.router.navigate([APP_ROUTES.cv]);
            return of(null);
          })
        );
      })
    );
  }

  deleteCv(cv: Cv) {
    this.cvService.deleteCvById(cv.id).pipe(
      catchError(() => {
        this.toastr.error(
          `Problème avec le serveur veuillez contacter l'admin`
        );
        return of(null);
      })
    ).subscribe(() => {
      this.toastr.success(`${cv.name} supprimé avec succès`);
      this.router.navigate([APP_ROUTES.cv]);
    });
  }
}
