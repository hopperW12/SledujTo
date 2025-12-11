export type MediaType = 'movie' | 'tv';

export interface MediaItem {
  id: number;
  type: MediaType;
  title: string;
  overview?: string;
  posterPath?: string;
  year?: string;
  seenAt?: string;
}
