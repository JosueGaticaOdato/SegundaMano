/**
 * Generates an array of page numbers and ellipses ('...') to render in a paginated UI.
 * This ensures we never display too many buttons and overflow the screen width.
 * 
 * @param currentPage The active page (1-indexed)
 * @param totalPages The total number of pages available
 * @returns An array of page numbers or '...' strings.
 */
export function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Case 1: Near the beginning (show first 5 pages, ellipsis, last page)
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }

  // Case 2: Near the end (show first page, ellipsis, last 5 pages)
  if (currentPage >= totalPages - 3) {
    return [
      1,
      '...',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // Case 3: In the middle (show first page, ellipsis, page before/after active, ellipsis, last page)
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
}
