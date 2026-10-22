/**
 * بوابة الفرص — Favorites Module (js/favorites.js)
 * Standalone, resilient favorites manager with localStorage persistence,
 * in-memory fallback, cross-tab synchronization, and custom event broadcasting.
 */
'use strict';

(function(root) {
  const STORAGE_KEY = 'op-favorites';
  const MAX_FAVORITES = 100;
  let memoryCache = new Set();
  let storageAvailable = null;

  /**
   * Check if localStorage is available and writable.
   * Handles SecurityError (e.g. blocked storage/cookies) and QuotaExceededError.
   * @returns {boolean}
   */
  function isStorageAvailable() {
    if (storageAvailable !== null) return storageAvailable;
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        storageAvailable = false;
        return false;
      }
      const testKey = '__op_storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      storageAvailable = true;
      return true;
    } catch (e) {
      storageAvailable = false;
      return false;
    }
  }

  /**
   * Safely load favorites from localStorage into memoryCache.
   * Handles corrupted JSON, non-array payloads, and storage errors.
   */
  function loadFromStorage() {
    memoryCache.clear();
    if (!isStorageAvailable()) return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (let i = 0; i < parsed.length; i++) {
          const item = parsed[i];
          if (typeof item === 'string' && item.trim().length > 0) {
            memoryCache.add(item.trim());
          }
        }
      } else {
        // Corrupted format (not an array) — safely reset
        console.warn('[Favorites] Corrupted storage format detected; resetting favorites array.');
        saveToStorage();
      }
    } catch (err) {
      console.warn('[Favorites] Error reading from localStorage, using memory fallback:', err);
    }
  }

  /**
   * Safely write current memoryCache to localStorage.
   * Handles QuotaExceededError and SecurityError.
   * @returns {boolean} Whether writing succeeded
   */
  function saveToStorage() {
    if (!isStorageAvailable()) return false;
    try {
      const arr = Array.from(memoryCache);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      return true;
    } catch (err) {
      console.warn('[Favorites] Failed to persist favorites to localStorage (QuotaExceeded or SecurityError):', err);
      return false;
    }
  }

  /**
   * Broadcast changes to other components via custom event on document.
   * @param {string|null} id - Target opportunity ID (if single item changed)
   * @param {boolean|null} isFav - Whether target ID is now a favorite
   */
  function broadcastChange(id = null, isFav = null) {
    if (typeof document === 'undefined') return;
    try {
      const detail = {
        favorites: Array.from(memoryCache),
        count: memoryCache.size,
        id: id,
        isFavorite: isFav !== null ? isFav : (id ? memoryCache.has(id) : null)
      };
      const event = new CustomEvent('favorites:changed', { detail });
      document.dispatchEvent(event);
    } catch (e) {
      console.error('[Favorites] Failed to dispatch favorites:changed event:', e);
    }
  }

  // Cross-tab / cross-window synchronization
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', function(e) {
      if (e.key === STORAGE_KEY) {
        loadFromStorage();
        broadcastChange(null, null);
      }
    });
  }

  // Initialize cache immediately
  loadFromStorage();

  /**
   * Public Favorites API
   */
  const Favorites = {
    /**
     * Get all favorited opportunity IDs as an array of strings.
     * @returns {string[]}
     */
    getFavorites: function() {
      return Array.from(memoryCache);
    },

    /**
     * Check if a specific opportunity ID is in favorites.
     * @param {string} id
     * @returns {boolean}
     */
    isFavorite: function(id) {
      if (!id || typeof id !== 'string') return false;
      return memoryCache.has(id.trim());
    },

    /**
     * Add an opportunity ID to favorites.
     * @param {string} id
     * @returns {boolean} Whether operation succeeded
     */
    addFavorite: function(id) {
      if (!id || typeof id !== 'string') return false;
      const cleanId = id.trim();
      if (!cleanId) return false;

      if (!memoryCache.has(cleanId)) {
        if (memoryCache.size >= MAX_FAVORITES) {
          console.warn('[Favorites] Maximum favorites limit (100) reached. Cannot add more items.');
          return false;
        }
        memoryCache.add(cleanId);
        saveToStorage();
        broadcastChange(cleanId, true);
      }
      return true;
    },

    /**
     * Remove an opportunity ID from favorites.
     * @param {string} id
     * @returns {boolean} Whether operation succeeded
     */
    removeFavorite: function(id) {
      if (!id || typeof id !== 'string') return false;
      const cleanId = id.trim();
      if (!cleanId) return false;

      if (memoryCache.has(cleanId)) {
        memoryCache.delete(cleanId);
        saveToStorage();
        broadcastChange(cleanId, false);
        return true;
      }
      return false;
    },

    /**
     * Toggle favorite status of an opportunity ID.
     * @param {string} id
     * @returns {boolean} New favorite state (true = favorited, false = unfavorited)
     */
    toggleFavorite: function(id) {
      if (!id || typeof id !== 'string') return false;
      const cleanId = id.trim();
      if (!cleanId) return false;

      if (memoryCache.has(cleanId)) {
        memoryCache.delete(cleanId);
        saveToStorage();
        broadcastChange(cleanId, false);
        return false;
      } else {
        memoryCache.add(cleanId);
        saveToStorage();
        broadcastChange(cleanId, true);
        return true;
      }
    },

    /**
     * Get total number of favorited opportunities.
     * @returns {number}
     */
    getFavoritesCount: function() {
      return memoryCache.size;
    },

    /**
     * Clear all favorites.
     * @returns {boolean}
     */
    clearFavorites: function() {
      if (memoryCache.size === 0) return true;
      memoryCache.clear();
      saveToStorage();
      broadcastChange(null, null);
      return true;
    },

    /**
     * Reload favorites from storage (useful for manual refresh or testing).
     */
    reload: function() {
      loadFromStorage();
      broadcastChange(null, null);
    },

    /**
     * Check if localStorage persistence is active (or in-memory fallback).
     * @returns {boolean}
     */
    isStorageSupported: function() {
      return isStorageAvailable();
    }
  };

  // Expose to window or module exports
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Favorites;
  }
  root.Favorites = Favorites;

})(typeof window !== 'undefined' ? window : global);