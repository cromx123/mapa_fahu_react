// utils/searchHistory.js
const STORAGE_KEY = "recent_searches";

export function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function addSearch(query) {
  const current = getRecentSearches();
  const updated = [query, ...current.filter((q) => q !== query)].slice(0, 5); 
  // guarda máximo 5
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearSearches() {
  localStorage.removeItem(STORAGE_KEY);
}
