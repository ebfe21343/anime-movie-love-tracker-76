
export type SortCategory = 'recently_added' | 'rating' | 'year' | 'personal';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  category: SortCategory;
  direction: SortDirection;
}
