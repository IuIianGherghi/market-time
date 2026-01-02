/**
 * Search Term Detection from Referrer
 *
 * Detects search terms from search engines (Google, Bing, Yahoo, etc.)
 * to help prioritize/sort products based on user intent
 */

export interface SearchTermData {
  term: string | null;
  source: 'google' | 'bing' | 'yahoo' | 'duckduckgo' | 'other' | null;
}

/**
 * Extract search term from referrer URL
 */
export function extractSearchTerm(referrer: string): SearchTermData {
  if (!referrer) {
    return { term: null, source: null };
  }

  try {
    const url = new URL(referrer);
    const hostname = url.hostname.toLowerCase();

    // Google Search
    if (hostname.includes('google')) {
      const term = url.searchParams.get('q');
      return {
        term: term || null,
        source: 'google'
      };
    }

    // Bing Search
    if (hostname.includes('bing')) {
      const term = url.searchParams.get('q');
      return {
        term: term || null,
        source: 'bing'
      };
    }

    // Yahoo Search
    if (hostname.includes('yahoo')) {
      const term = url.searchParams.get('p');
      return {
        term: term || null,
        source: 'yahoo'
      };
    }

    // DuckDuckGo
    if (hostname.includes('duckduckgo')) {
      const term = url.searchParams.get('q');
      return {
        term: term || null,
        source: 'duckduckgo'
      };
    }

    return { term: null, source: 'other' };
  } catch (error) {
    console.error('Error parsing referrer:', error);
    return { term: null, source: null };
  }
}

/**
 * Get search term from browser referrer
 * Works only on client-side
 */
export function getSearchTermFromBrowser(): SearchTermData {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { term: null, source: null };
  }

  const referrer = document.referrer;
  return extractSearchTerm(referrer);
}

/**
 * Store search term in session storage for persistence during navigation
 */
export function storeSearchTerm(searchData: SearchTermData): void {
  if (typeof window === 'undefined') return;

  if (searchData.term) {
    sessionStorage.setItem('search_term', searchData.term);
    sessionStorage.setItem('search_source', searchData.source || 'unknown');
    sessionStorage.setItem('search_timestamp', Date.now().toString());
  }
}

/**
 * Retrieve stored search term from session storage
 */
export function getStoredSearchTerm(): SearchTermData {
  if (typeof window === 'undefined') {
    return { term: null, source: null };
  }

  const term = sessionStorage.getItem('search_term');
  const source = sessionStorage.getItem('search_source') as SearchTermData['source'];
  const timestamp = sessionStorage.getItem('search_timestamp');

  // Clear after 30 minutes
  if (timestamp && Date.now() - parseInt(timestamp) > 30 * 60 * 1000) {
    clearStoredSearchTerm();
    return { term: null, source: null };
  }

  return { term, source };
}

/**
 * Clear stored search term
 */
export function clearStoredSearchTerm(): void {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem('search_term');
  sessionStorage.removeItem('search_source');
  sessionStorage.removeItem('search_timestamp');
}

/**
 * Determine if product matches search term
 * Used for relevance scoring
 */
export function productMatchesSearchTerm(productTitle: string, searchTerm: string): number {
  if (!searchTerm) return 0;

  const title = productTitle.toLowerCase();
  const term = searchTerm.toLowerCase();
  const words = term.split(/\s+/);

  let score = 0;

  // Exact match
  if (title === term) {
    score += 100;
  }

  // Contains exact phrase
  if (title.includes(term)) {
    score += 50;
  }

  // Title starts with search term
  if (title.startsWith(term)) {
    score += 30;
  }

  // Count matching words
  const matchingWords = words.filter(word => title.includes(word));
  score += (matchingWords.length / words.length) * 20;

  return score;
}
