/**
 * Market-Time Tracking Library
 *
 * Handles Google Tag Manager integration, affiliate link tracking,
 * and URL parameter pass-through (gclid, fbclid, msclkid)
 */

import type { Product } from '@/types/product';

// Tracking parameter keys
const TRACKING_PARAMS = ['gclid', 'fbclid', 'msclkid', 'utm_source', 'utm_medium', 'utm_campaign'] as const;
type TrackingParam = typeof TRACKING_PARAMS[number];

// Storage keys
const STORAGE_KEY = 'mt_tracking_data';
const STORAGE_EXPIRY_KEY = 'mt_tracking_expiry';
const STORAGE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// Extend Window interface for GTM dataLayer
declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Initialize tracking on page load
 * Captures URL parameters and stores them
 */
export function initializeTracking(): void {
  if (typeof window === 'undefined') return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];

  // Capture and store tracking parameters from URL
  captureTrackingParams();
}

/**
 * Capture tracking parameters from URL query string
 */
function captureTrackingParams(): void {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const trackingData: Partial<Record<TrackingParam, string>> = {};
  let hasNewParams = false;

  // Extract tracking parameters from URL
  TRACKING_PARAMS.forEach((param) => {
    const value = urlParams.get(param);
    if (value) {
      trackingData[param] = value;
      hasNewParams = true;
    }
  });

  // If we found new parameters, merge with existing and update storage
  if (hasNewParams) {
    const existingData = getStoredTrackingData();
    const mergedData = { ...existingData, ...trackingData };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
    localStorage.setItem(STORAGE_EXPIRY_KEY, String(Date.now() + STORAGE_DURATION));

    // Push to dataLayer for GTM
    pushToDataLayer({
      event: 'tracking_params_captured',
      tracking_data: mergedData,
    });
  }
}

/**
 * Get stored tracking data from localStorage
 */
function getStoredTrackingData(): Partial<Record<TrackingParam, string>> {
  if (typeof window === 'undefined') return {};

  try {
    const expiry = localStorage.getItem(STORAGE_EXPIRY_KEY);

    // Check if data has expired
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_EXPIRY_KEY);
      return {};
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading tracking data:', error);
  }

  return {};
}

/**
 * Enhance affiliate link with tracking parameters
 * Adds gclid, fbclid, msclkid to the affiliate URL
 */
export function enhanceAffiliateLink(affiliateUrl: string): string {
  if (typeof window === 'undefined') return affiliateUrl;

  const trackingData = getStoredTrackingData();

  // If no tracking data, return original URL
  if (Object.keys(trackingData).length === 0) {
    return affiliateUrl;
  }

  try {
    const url = new URL(affiliateUrl);

    // Add tracking parameters to the URL
    Object.entries(trackingData).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });

    return url.toString();
  } catch (error) {
    console.error('Error enhancing affiliate link:', error);
    return affiliateUrl;
  }
}

/**
 * Track product view
 * Sends product view event to GTM dataLayer
 */
export function trackProductView(product: Product, category?: string): void {
  pushToDataLayer({
    event: 'view_item',
    ecommerce: {
      items: [{
        item_id: product.sku,
        item_name: product.title,
        item_brand: product.brand || 'Unknown',
        item_category: category || product.category_ids[0] || 'Unknown',
        price: product.price,
        discount: product.discount_percentage,
        merchant: product.merchant.name,
      }],
    },
    product_id: product.id,
    product_slug: product.slug,
    merchant_id: product.merchant.id,
    tracking_data: getStoredTrackingData(),
  });
}

/**
 * Track affiliate link click
 * Sends click event to GTM dataLayer with enhanced tracking
 */
export function trackAffiliateClick(product: Product, category?: string): void {
  const trackingData = getStoredTrackingData();

  pushToDataLayer({
    event: 'affiliate_click',
    ecommerce: {
      items: [{
        item_id: product.sku,
        item_name: product.title,
        item_brand: product.brand || 'Unknown',
        item_category: category || product.category_ids[0] || 'Unknown',
        price: product.price,
        discount: product.discount_percentage,
        merchant: product.merchant.name,
      }],
    },
    click_url: product.product_url,
    product_id: product.id,
    product_slug: product.slug,
    merchant_id: product.merchant.id,
    merchant_name: product.merchant.name,
    tracking_source: trackingData.gclid ? 'google' : trackingData.fbclid ? 'facebook' : trackingData.msclkid ? 'microsoft' : 'direct',
    tracking_data: trackingData,
  });
}

/**
 * Track search query
 */
export function trackSearch(query: string, results: number): void {
  pushToDataLayer({
    event: 'search',
    search_term: query,
    search_results: results,
  });
}

/**
 * Track filter usage
 */
export function trackFilter(filterType: string, filterValue: string): void {
  pushToDataLayer({
    event: 'filter_used',
    filter_type: filterType,
    filter_value: filterValue,
  });
}

/**
 * Push event to GTM dataLayer
 */
function pushToDataLayer(data: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

/**
 * Get current traffic source based on stored tracking data
 */
export function getTrafficSource(): 'google' | 'facebook' | 'microsoft' | 'organic' | 'direct' {
  const trackingData = getStoredTrackingData();

  if (trackingData.gclid) return 'google';
  if (trackingData.fbclid) return 'facebook';
  if (trackingData.msclkid) return 'microsoft';
  if (trackingData.utm_source) return 'organic';

  return 'direct';
}

/**
 * Get tracking data for debugging
 */
export function getTrackingDebugInfo(): {
  stored: Partial<Record<TrackingParam, string>>;
  source: string;
  expiry: string | null;
} {
  const stored = getStoredTrackingData();
  const source = getTrafficSource();
  const expiry = localStorage.getItem(STORAGE_EXPIRY_KEY);

  return {
    stored,
    source,
    expiry: expiry ? new Date(parseInt(expiry, 10)).toISOString() : null,
  };
}
