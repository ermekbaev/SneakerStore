// src/components/search/index.ts
export { default as AdvancedSearchBar } from './AdvancedSearchBar';
export { default as MobileSearchModal } from './MobileSearchModal';
export { default as SearchFiltersComponent } from './SearchFilters';
export type { SearchFilters } from './SearchFilters';

// src/hooks/search/index.ts
export { useAdvancedSearch } from '../../hooks/useAdvancedSearch';
export { useDebounce } from '../../hooks/useDebounce';