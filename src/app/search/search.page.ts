import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonSpinner,
  IonThumbnail,
  IonText,
  IonImg,
  IonIcon,
} from '@ionic/angular/standalone';
import { tvOutline, filmOutline, imageOutline, starOutline, star } from 'ionicons/icons';
import { TmdbService } from '../services/tmdb.service';
import { SeenItemsService } from '../services/seen-items.service';
import { MediaItem } from '../models/media-item.model';
import { environment } from '../../environments/environment';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonSpinner,
    IonThumbnail,
    IonText,
    IonImg,
    IonIcon,
  ],
})
export class SearchPage {
  private readonly tmdbService = inject(TmdbService);
  private readonly seenItemsService = inject(SeenItemsService);

  query = '';
  isSearching = false;
  results: MediaItem[] = [];
  errorMessage = '';
  readonly imageBaseUrl = environment.tmdbImageBaseUrl;

  constructor() {
    addIcons({ tvOutline, filmOutline, imageOutline, starOutline, star });
  }

  onSearchChange(event: CustomEvent) {
    const value = (event.detail as any)?.value ?? '';
    this.query = value;
    this.search();
  }

  search() {
    const trimmed = this.query.trim();
    if (!trimmed) {
      this.results = [];
      this.errorMessage = '';
      return;
    }

    this.isSearching = true;
    this.errorMessage = '';

    this.tmdbService.searchMulti(trimmed).subscribe({
      next: (items) => {
        this.results = items;
        this.isSearching = false;
      },
      error: () => {
        this.isSearching = false;
        this.errorMessage = 'Při hledání došlo k chybě. Zkus to prosím znovu.';
      },
    });
  }

  markAsSeen(item: MediaItem) {
    this.seenItemsService.markAsSeen(item);
  }

  isSeen(item: MediaItem): boolean {
    return this.seenItemsService.isSeen(item);
  }

  toggleSeen(item: MediaItem): void {
    this.seenItemsService.toggleSeen(item);
  }
}
