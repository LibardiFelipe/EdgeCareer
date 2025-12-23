"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function MonthPicker({ value, onChange, disabled, error, placeholder = "Select month" }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(null);

  // Parse the value prop (format: "yyyy-MM")
  React.useEffect(() => {
    if (value) {
      const [year, month] = value.split("-");
      if (year && month) {
        const date = new Date(parseInt(year), parseInt(month) - 1);
        setSelectedDate(date);
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const currentYear = new Date().getFullYear();
  const [displayYear, setDisplayYear] = React.useState(
    selectedDate ? selectedDate.getFullYear() : currentYear
  );

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(displayYear, monthIndex);
    setSelectedDate(newDate);

    // Format as "yyyy-MM" to match the expected format
    const formattedValue = format(newDate, "yyyy-MM");
    onChange(formattedValue);
    setIsOpen(false);
  };

  const handleYearChange = (increment) => {
    setDisplayYear(prev => prev + increment);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            error && "border-red-500"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "MMM yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          {/* Year selector */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleYearChange(-1)}
            >
              <span className="sr-only">Previous year</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </Button>
            <div className="font-semibold">{displayYear}</div>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleYearChange(1)}
            >
              <span className="sr-only">Next year</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month, index) => {
              const isSelected =
                selectedDate &&
                selectedDate.getMonth() === index &&
                selectedDate.getFullYear() === displayYear;

              return (
                <Button
                  key={month}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-9",
                    isSelected && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleMonthSelect(index)}
                >
                  {month}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
