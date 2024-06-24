// breadcrumb.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  setBreadcrumbs(breadcrumbs: Breadcrumb[]) {
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  addBreadcrumb(breadcrumb: Breadcrumb) {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;
    this.breadcrumbsSubject.next([...currentBreadcrumbs, breadcrumb]);
  }
}
