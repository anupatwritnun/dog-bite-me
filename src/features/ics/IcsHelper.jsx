import React, { useMemo } from "react";
import Card from "../../components/Card";
import { addDaysISO } from "../../utils/dates";
import { formatDateISO } from "../../utils/format";

// ✨ Helper function to generate the Google Calendar URL (remains the same)
const generateGoogleCalendarUrl = (event) => {
  const startDate = event.date.replace(/-/g, "");
  const dateObj = new Date(event.date);
  dateObj.setDate(dateObj.getDate() + 1);
  const endDate = dateObj.toISOString().slice(0, 10).replace(/-/g, "");
  const encodedTitle = encodeURIComponent(event.title);
  
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${startDate}/${endDate}`;
};


export default function IcsHelper({ t, lang, startDate, scheduleDates, decision }) {
  const allEvents = useMemo(() => {
    const rabiesEvents = (scheduleDates || []).map((date, i) => ({
      key: `rabies-${i}`,
      title: `นัดฉีดวัคซีนพิษสุนัขบ้า เข็มที่ ${i + 1}`,
      date: date,
    }));

    const tetanusEvents = (decision?.tetanus?.offsets || []).map((offset, i) => ({
      key: `tetanus-${i}`,
      title: `นัดฉีดวัคซีนบาดทะยัก เข็มที่ ${i + 1}`,
      date: addDaysISO(startDate, offset),
    }));

    return [...rabiesEvents, ...tetanusEvents];
  }, [scheduleDates, decision, startDate]);

  return (
    <Card title="ตัวคำนวณนัด (.ics)" icon="🗓️">
      {/* Smaller, grey-colored text for the subtitle */}
      <p className="mb-4 text-sm text-gray-500">สามารถเพิ่มนัดหมายแต่ละรายการลงใน Google Calendar ได้โดยตรง</p>
      
      <ul className="space-y-3">
        {allEvents.map((event) => (
          <li key={event.key} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
            <span>
              {`${event.title} — ${formatDateISO(event.date, lang)}`}
            </span>
            
            {/* 🔗 Link with the calendar icon */}
            <a
              href={generateGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              // Removed button-like styling, just added some margin-left for spacing
              className="ml-2" 
              title="เพิ่มในปฏิทิน Google" // Optional: Add a tooltip on hover
            >
              {/* Using an img tag for the icon */}
              <img 
                src="/icons/calendar.png" // Path relative to the `public` folder
                alt="เพิ่มในปฏิทิน" 
                className="w-6 h-6 inline-block" // Adjust width and height as needed
              />
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}