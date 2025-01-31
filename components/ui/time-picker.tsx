"use client";

import * as React from "react";
import { Button } from "./button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const handleHourChange = (value: number) => {
    const newDate = new Date(date);
    newDate.setHours(value);
    setDate(newDate);
  };

  const handleMinuteChange = (value: number) => {
    const newDate = new Date(date);
    newDate.setMinutes(value);
    setDate(newDate);
  };

  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleHourChange(date.getHours() + 1)}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">
          {date.getHours().toString().padStart(2, "0")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleHourChange(date.getHours() - 1)}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <span>:</span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleMinuteChange(date.getMinutes() + 1)}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">
          {date.getMinutes().toString().padStart(2, "0")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleMinuteChange(date.getMinutes() - 1)}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 