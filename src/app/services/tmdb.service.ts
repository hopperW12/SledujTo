import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { MediaItem } from '../models/media-item.model';

interface TmdbSearchResult {
  page: number;
  results: Array<{
    id: number;
    media_type: 'movie' | 'tv' | string;
    title?: string;
    name?: string;
    overview?: string;
    poster_path?: string;
    release_date?: string;
    first_air_date?: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.tmdbBaseUrl;
  private readonly accessToken = environment.tmdbAccessToken;

  searchMulti(query: string): Observable<MediaItem[]> {
    if (!query?.trim()) {
      return of([]);
    }

    const params = new HttpParams()
      .set('include_adult', 'false')
      .set('language', 'cs-CZ')
      .set('page', 1)
      .set('query', query);

    const headers = new HttpHeaders({
      accept: 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http
      .get<TmdbSearchResult>(`${this.baseUrl}/search/multi`, { params, headers })
      .pipe(
        map((res) =>
          (res.results || [])
            .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
            .map<MediaItem>((r) => {
              const isMovie = r.media_type === 'movie';
              const rawDate = isMovie ? r.release_date : r.first_air_date;
              const year = rawDate ? new Date(rawDate).getFullYear().toString() : undefined;

              return {
                id: r.id,
                type: isMovie ? 'movie' : 'tv',
                title: (isMovie ? r.title : r.name) ?? '',
                overview: r.overview,
                posterPath: r.poster_path ?? undefined,
                year,
              };
            })
        ),
        catchError((err) => {
          console.error('TMDB search error', err);
          return of([]);
        })
      );
  }
}
