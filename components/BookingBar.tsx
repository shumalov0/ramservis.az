"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { locations, cars } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Car } from "lucide-react";

type CarTypeOption = { value: string; label: string };

export default function BookingBar() {
  const router = useRouter();

  const carTypes: CarTypeOption[] = useMemo(() => {
    const classes = Array.from(new Set(cars.map((c) => c.class)));
    return classes.map((cls) => ({ value: cls, label: cls }));
  }, []);

  const [carType, setCarType] = useState<string | undefined>();
  const [pickupLocation, setPickupLocation] = useState<string | undefined>();
  const [dropoffLocation, setDropoffLocation] = useState<string | undefined>();
  const [pickupDate, setPickupDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");

  // Refs for date inputs
  const pickupDateRef = useRef<HTMLInputElement>(null);
  const returnDateRef = useRef<HTMLInputElement>(null);

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Update return date when pickup date changes
  useEffect(() => {
    if (pickupDate && (!returnDate || returnDate <= pickupDate)) {
      const nextDay = new Date(pickupDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setReturnDate(nextDay.toISOString().split("T")[0]);
    }
  }, [pickupDate, returnDate]);

  const isValid = pickupLocation && dropoffLocation && pickupDate && returnDate;

  const handleSubmit = () => {
    // Cars səhifəsinə yönləndiririk və filtrlər ötürürük
    const params = new URLSearchParams();
    if (carType) params.set("category", carType);
    if (pickupLocation) params.set("pickup", pickupLocation);
    if (dropoffLocation) params.set("dropoff", dropoffLocation);
    if (pickupDate) params.set("from", pickupDate);
    if (returnDate) params.set("to", returnDate);

    // Cars səhifəsinə yönləndiririk
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <div className="w-full rounded-[20px] md:rounded-[30px] relative border bg-white/90 dark:bg-brand-dark/70 backdrop-blur p-4 md:p-10">
      {/* Mobile Layout */}
      <div className="block md:hidden space-y-4">
        {/* Car Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Car Type (Optional)
          </label>
          <div className="relative">
            <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Select onValueChange={(v) => setCarType(v)} value={carType}>
              <SelectTrigger className="pl-10 h-12">
                <SelectValue placeholder="Choose Car Type" />
              </SelectTrigger>
              <SelectContent>
                {carTypes.map((ct) => (
                  <SelectItem key={ct.value} value={ct.value}>
                    {ct.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Locations Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pick Up Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <Select
                onValueChange={(v) => setPickupLocation(v)}
                value={pickupLocation}
              >
                <SelectTrigger className="pl-10 h-12">
                  <SelectValue placeholder="Pick Up" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Drop Off Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <Select
                onValueChange={(v) => setDropoffLocation(v)}
                value={dropoffLocation}
              >
                <SelectTrigger className="pl-10 h-12">
                  <SelectValue placeholder="Drop Off" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Dates Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pick Up Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
              <div
                className="w-full h-12 pl-10 pr-3 text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f5b754] focus:border-[#f5b754] bg-white dark:bg-[#1a1a1a] flex items-center cursor-pointer transition-colors"
                onClick={() =>
                  pickupDateRef.current?.showPicker?.() ||
                  pickupDateRef.current?.focus()
                }
              >
                <span
                  className={`${
                    pickupDate
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500"
                  }`}
                >
                  {pickupDate
                    ? formatDateForDisplay(pickupDate)
                    : "Pick Up Date"}
                </span>
              </div>
              <Input
                ref={pickupDateRef}
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={today}
                className="absolute inset-0 opacity-0 cursor-pointer"
                style={{
                  colorScheme: "light",
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Return Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none " />
              <div
                className="w-full h-12 pl-10 pr-3 text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f5b754] focus:border-[#f5b754] bg-white dark:bg-[#1a1a1a] flex items-center cursor-pointer transition-colors"
                onClick={() =>
                  returnDateRef.current?.showPicker?.() ||
                  returnDateRef.current?.focus()
                }
              >
                <span
                  className={`${
                    returnDate
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500"
                  }`}
                >
                  {returnDate
                    ? formatDateForDisplay(returnDate)
                    : "Return Date"}
                </span>
              </div>
              <Input
                ref={returnDateRef}
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={pickupDate || today}
                className="absolute inset-0 opacity-0 cursor-pointer"
                style={{
                  colorScheme: "light",
                }}
              />
            </div>
          </div>
        </div>

        {/* Rent Now Button */}
        <Button
          className="w-full py-4 h-12 rounded-[20px] bg-[#f5b754] hover:bg-[#e6a643] text-black font-semibold transition-colors duration-200 text-lg"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          Rent Now
        </Button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-6 gap-4">
        {/* Car Type Selection */}
        <div className="md:col-span-1 md:border-r-[1px] border-gray-400 dark:border-[#f5b754] md:pr-4">
          <div className="relative">
            <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Select onValueChange={(v) => setCarType(v)} value={carType}>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Choose Car Type" />
              </SelectTrigger>
              <SelectContent>
                {carTypes.map((ct) => (
                  <SelectItem key={ct.value} value={ct.value}>
                    {ct.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pick Up Location */}
        <div className="md:col-span-1 md:border-r-[1px] border-gray-400 dark:border-[#f5b754] md:pr-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Select
              onValueChange={(v) => setPickupLocation(v)}
              value={pickupLocation}
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Pick Up Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pick Up Date */}
        <div className="md:col-span-1 md:border-r-[1px] border-gray-400 dark:border-[#f5b754] md:pr-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
            <div
              className="w-full h-10 pl-10 pr-3 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f5b754] focus:border-[#f5b754] bg-white dark:bg-[#1a1a1a] flex items-center cursor-pointer transition-colors"
              onClick={() =>
                pickupDateRef.current?.showPicker?.() ||
                pickupDateRef.current?.focus()
              }
            >
              <span
                className={`${
                  pickupDate ? "text-gray-900 dark:text-white" : "text-gray-500"
                } text-sm`}
              >
                {pickupDate ? formatDateForDisplay(pickupDate) : "Pick Up Date"}
              </span>
            </div>
            <Input
              ref={pickupDateRef}
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={today}
              className="absolute inset-0 opacity-0 cursor-pointer"
              style={{
                colorScheme: "light",
              }}
            />
          </div>
        </div>

        {/* Drop Off Location */}
        <div className="md:col-span-1 md:border-r-[1px] border-gray-400 dark:border-[#f5b754] md:pr-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Select
              onValueChange={(v) => setDropoffLocation(v)}
              value={dropoffLocation}
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Drop Off Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Return Date */}
        <div className="md:col-span-1 md:pr-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
            <div
              className="w-full h-10 pl-10 pr-3 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f5b754] focus:border-[#f5b754] bg-white dark:bg-[#1a1a1a] flex items-center cursor-pointer transition-colors"
              onClick={() =>
                returnDateRef.current?.showPicker?.() ||
                returnDateRef.current?.focus()
              }
            >
              <span
                className={`${
                  returnDate ? "text-gray-900 dark:text-white" : "text-gray-500"
                } text-sm`}
              >
                {returnDate ? formatDateForDisplay(returnDate) : "Return Date"}
              </span>
            </div>
            <Input
              ref={returnDateRef}
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={pickupDate || today}
              className="absolute inset-0 opacity-0 cursor-pointer"
              style={{
                colorScheme: "light",
              }}
            />
          </div>
        </div>

        {/* Rent Now Button */}
        <div className="md:col-span-1 flex items-stretch">
          <Button
            className="w-full py-5 rounded-[30px] bg-[#f5b754] hover:bg-[#e6a643] text-black font-semibold transition-colors duration-200"
            disabled={!isValid}
            onClick={handleSubmit}
          >
            Rent Now
          </Button>
        </div>
      </div>
    </div>
  );
}
