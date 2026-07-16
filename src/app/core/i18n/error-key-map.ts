/**
 * Central error key mapping for backend error messages.
 * Maps known backend error messages to their corresponding translation keys.
 *
 * When the backend returns an error with a `message` field, this map is used
 * to find the appropriate translated message. If no mapping is found,
 * 'common.errors.generic' is used as fallback.
 */

import { HttpErrorResponse } from '@angular/common/http';

/**
 * Maps backend error message strings to i18n translation keys.
 * Supports both exact matches and prefix-based matches (for messages with dynamic IDs).
 */
export const BACKEND_ERROR_KEY_MAP: Record<string, string> = {
  // Book errors
  'Book not found': 'backendErrors.bookNotFound',
  'Book not found with id': 'backendErrors.bookNotFound',

  // Partner errors
  'Partner not found': 'backendErrors.partnerNotFound',
  'Partner not found with id': 'backendErrors.partnerNotFound',

  // Shipment errors
  'Shipment not found with id': 'backendErrors.shipmentNotFound',

  // Settlement errors
  'Settlement not found with id': 'backendErrors.settlementNotFound',

  // Direct sale errors
  'Direct sale not found with id': 'backendErrors.directSaleNotFound',

  // Expense errors
  'Expense not found with id': 'backendErrors.expenseNotFound',

  // Stock movement errors
  'Only manual stock movement types are allowed through this endpoint.': 'backendErrors.onlyManualMovements',

  // User/Auth errors
  'User not found': 'backendErrors.userNotFound',
  'Old password is incorrect': 'backendErrors.oldPasswordIncorrect',
  'An unexpected error occurred': 'backendErrors.unexpectedError'
};

/**
 * Resolves a backend error message to an i18n translation key.
 * Checks for exact match first, then tries prefix-based matching
 * (for messages like "Book not found with id: 123").
 *
 * @param backendMessage - The error message from the backend response
 * @returns The translation key if found, or null for unknown errors
 */
export function resolveErrorKey(backendMessage: string | undefined | null): string | null {
  if (!backendMessage) {
    return null;
  }

  // Exact match
  if (BACKEND_ERROR_KEY_MAP[backendMessage]) {
    return BACKEND_ERROR_KEY_MAP[backendMessage];
  }

  // Prefix-based match (for messages like "Book not found with id: 123")
  for (const [pattern, key] of Object.entries(BACKEND_ERROR_KEY_MAP)) {
    if (backendMessage.startsWith(pattern)) {
      return key;
    }
  }

  return null;
}

/**
 * Resolves an HttpErrorResponse to the appropriate i18n translation key.
 * Handles three cases per the design spec:
 * 1. Network error (status === 0 or no response) → 'common.errors.network'
 * 2. Known backend error (mapped message) → corresponding translation key
 * 3. Unknown backend error → 'common.errors.generic'
 *
 * @param error - The HttpErrorResponse from an HTTP call
 * @returns The translation key to use for displaying the error message
 */
export function resolveHttpErrorKey(error: HttpErrorResponse): string {
  // Network error: browser couldn't reach the server
  if (error.status === 0) {
    return 'common.errors.network';
  }

  // Try to resolve known backend error message
  const backendMessage = error.error?.message;
  const knownKey = resolveErrorKey(backendMessage);

  if (knownKey) {
    return knownKey;
  }

  // Fallback: unknown backend error
  return 'common.errors.generic';
}
