'use client';

import { useState, useEffect, useMemo } from 'react';

interface UsePaginationProps {
  totalItems: number;
  initialItemsPerPage?: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  paginatedItems: <T>(items: T[]) => T[];
}

export function usePagination({
  totalItems,
  initialItemsPerPage = 12,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPageState] = useState(initialPage);
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  // Calculate start and end indices
  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, totalItems);
  }, [startIndex, itemsPerPage, totalItems]);

  // Navigation helpers
  const canGoNext = currentPage < totalPages;
  const canGoPrevious = currentPage > 1;

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPageState(1);
  }, [itemsPerPage]);

  // Ensure current page is valid when total items change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPageState(totalPages);
    }
  }, [currentPage, totalPages]);

  const setCurrentPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPageState(page);
    }
  };

  const setItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPageState(newItemsPerPage);
  };

  const goToNextPage = () => {
    if (canGoNext) {
      setCurrentPageState(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (canGoPrevious) {
      setCurrentPageState(prev => prev - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPageState(1);
  };

  const goToLastPage = () => {
    setCurrentPageState(totalPages);
  };

  const paginatedItems = <T,>(items: T[]): T[] => {
    return items.slice(startIndex, endIndex);
  };

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    setCurrentPage,
    setItemsPerPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    canGoNext,
    canGoPrevious,
    paginatedItems,
  };
}