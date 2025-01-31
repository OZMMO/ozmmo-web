"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date>(date);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setSelectedDateTime(selectedDate);
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const newDateTime = new Date(selectedDateTime);
    newDateTime.setHours(hours);
    newDateTime.setMinutes(minutes);
    setSelectedDateTime(newDateTime);
    setDate(newDateTime);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP p") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDateTime}
          onSelect={handleSelect}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <Select onValueChange={handleTimeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 * 4 }).map((_, i) => {
                const hours = Math.floor(i / 4);
                const minutes = (i % 4) * 15;
                const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
                return (
                  <SelectItem key={i} value={timeString}>
                    {timeString}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
