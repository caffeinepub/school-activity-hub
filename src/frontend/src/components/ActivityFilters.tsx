import { useState } from 'react';
import { Category } from '../backend';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export interface FilterState {
  category: Category | 'all';
  searchQuery: string;
  dateFrom: string;
  dateTo: string;
}

interface ActivityFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function ActivityFilters({ filters, onFiltersChange }: ActivityFiltersProps) {
  const handleCategoryChange = (value: string) => {
    onFiltersChange({ ...filters, category: value as Category | 'all' });
  };

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handleDateFromChange = (value: string) => {
    onFiltersChange({ ...filters, dateFrom: value });
  };

  const handleDateToChange = (value: string) => {
    onFiltersChange({ ...filters, dateTo: value });
  };

  const handleClearFilters = () => {
    onFiltersChange({ category: 'all', searchQuery: '', dateFrom: '', dateTo: '' });
  };

  const hasActiveFilters =
    filters.category !== 'all' || filters.searchQuery || filters.dateFrom || filters.dateTo;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Search className="w-5 h-5 text-orange-500" />
          Filter Activities
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-orange-600">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search activities..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="border-orange-200 focus:border-orange-500"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={filters.category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category" className="border-orange-200 focus:border-orange-500">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value={Category.sports}>Sports</SelectItem>
              <SelectItem value={Category.academic}>Academic</SelectItem>
              <SelectItem value={Category.arts}>Arts</SelectItem>
              <SelectItem value={Category.social}>Social</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date From */}
        <div className="space-y-2">
          <Label htmlFor="dateFrom">From Date</Label>
          <Input
            id="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleDateFromChange(e.target.value)}
            className="border-orange-200 focus:border-orange-500"
          />
        </div>

        {/* Date To */}
        <div className="space-y-2">
          <Label htmlFor="dateTo">To Date</Label>
          <Input
            id="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleDateToChange(e.target.value)}
            className="border-orange-200 focus:border-orange-500"
          />
        </div>
      </div>
    </div>
  );
}
