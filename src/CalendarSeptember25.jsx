import { useState, useEffect } from "react";
import CalendarNavigation from "./components/CalendarNavigation";
import CalendarLegend from "./components/CalendarLegend";
import TimeSlot from "./components/TimeSlot";
import {
  generateTimeSlots,
  getDaysToShow,
  formatDate,
  getDateRangeTitle,
  isInWorkingHours,
} from "./utils/calendarUtils";

const CalendarSeptember25 = () => {
  const [currentView, setCurrentView] = useState("week");
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 8, 1));
  const [lessons, setLessons] = useState([]);

  // Моковые данные занятий
  const mockLessons = [
    {
      id: 1,
      date: new Date(2025, 8, 1, 9, 0),
      duration: 60,
      title: "Математика",
    },
    { id: 2, date: new Date(2025, 8, 1, 11, 0), duration: 90, title: "Физика" },
    { id: 3, date: new Date(2025, 8, 2, 10, 0), duration: 30, title: "Химия" },
    {
      id: 4,
      date: new Date(2025, 8, 3, 14, 0),
      duration: 60,
      title: "Биология",
    },
    {
      id: 5,
      date: new Date(2025, 8, 4, 16, 0),
      duration: 90,
      title: "История",
    },
    {
      id: 6,
      date: new Date(2025, 8, 8, 13, 0),
      duration: 60,
      title: "Литература",
    },
    {
      id: 7,
      date: new Date(2025, 8, 9, 15, 0),
      duration: 30,
      title: "География",
    },
  ];

  useEffect(() => {
    setLessons(mockLessons);

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentView("day");
      } else if (window.innerWidth < 1024) {
        setCurrentView("three-day");
      } else {
        setCurrentView("week");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Навигация: переключение периодов
  const navigatePeriod = (direction) => {
    const newDate = new Date(selectedDate);

    switch (currentView) {
      case "day": {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      }
      case "three-day": {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 3 : -3));
        break;
      }
      case "week": {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      }
      default: {
        break;
      }
    }

    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date(2025, 8, 1));
  };

  const timeSlots = generateTimeSlots();
  const daysToShow = getDaysToShow(selectedDate, currentView);
  const dateRangeTitle = getDateRangeTitle(daysToShow);

  // Проверка, является ли слот частью занятия
  const getLessonForSlot = (date, timeSlot) => {
    return lessons.find((lesson) => {
      const lessonDate = new Date(lesson.date);
      const lessonEnd = new Date(lessonDate);
      lessonEnd.setMinutes(lessonEnd.getMinutes() + lesson.duration);

      const slotStart = new Date(date);
      slotStart.setHours(timeSlot.hours, timeSlot.minutes, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + 30);

      return slotStart >= lessonDate && slotStart < lessonEnd;
    });
  };

  // Проверка, является ли это первым слотом занятия
  const isFirstSlotOfLesson = (date, timeSlot, lesson) => {
    if (!lesson) return false;

    const lessonDate = new Date(lesson.date);
    return (
      lessonDate.getHours() === timeSlot.hours &&
      lessonDate.getMinutes() === timeSlot.minutes &&
      new Date(date).toDateString() === lessonDate.toDateString()
    );
  };

  // Получение количества слотов для занятия
  const getLessonSlotsCount = (duration) => {
    return Math.ceil(duration / 30);
  };

  // Получение позиции занятия в гриде
  const getLessonGridPosition = (date, timeSlot, lesson) => {
    if (!lesson) return null;

    const dayIndex = daysToShow.findIndex(
      (d) => d.toDateString() === date.toDateString()
    );

    const timeIndex = timeSlots.findIndex(
      (ts) => ts.hours === timeSlot.hours && ts.minutes === timeSlot.minutes
    );

    if (dayIndex === -1 || timeIndex === -1) return null;

    const slotsCount = getLessonSlotsCount(lesson.duration);

    return {
      gridRow: `${timeIndex + 2} / span ${slotsCount}`,
      gridColumn: dayIndex + 2,
    };
  };

  // Обработчик клика по слоту
  const handleSlotClick = (date, timeSlot) => {
    const lesson = getLessonForSlot(date, timeSlot);
    const slotTime = new Date(date);
    slotTime.setHours(timeSlot.hours, timeSlot.minutes);

    if (lesson) {
      alert(
        `Занятие: ${
          lesson.title
        }\nВремя: ${slotTime.toLocaleTimeString()}\nДлительность: ${
          lesson.duration
        } мин.`
      );
    } else {
      alert(`Свободный слот: ${slotTime.toLocaleTimeString()}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <CalendarNavigation
        onNavigate={navigatePeriod}
        onToday={goToToday}
        currentView={currentView}
        onViewChange={setCurrentView}
        dateRangeTitle={dateRangeTitle}
      />

      <div className="overflow-x-auto">
        <div
          className="grid gap-1 relative"
          style={{
            // Динамическое количество колонок с гибкой шириной
            gridTemplateColumns: `70px repeat(${daysToShow.length}, minmax(120px, 1fr))`,
          }}
        >
          {/* Заголовок с временами */}
          <div className="bg-gray-100 p-2 rounded text-center font-semibold">
            Время
          </div>

          {/* Заголовки дней - растягиваются на всю доступную ширину */}
          {daysToShow.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="bg-gray-100 p-2 rounded text-center font-semibold"
            >
              {formatDate(day)}
            </div>
          ))}

          {/* Временные метки */}
          {timeSlots.map((timeSlot, timeIndex) => (
            <div
              key={`time-${timeIndex}`}
              className="bg-gray-50 p-2 text-xs text-gray-600 text-center"
              style={{
                gridRow: timeIndex + 2,
                gridColumn: 1,
              }}
            >
              {timeSlot.formatted}
            </div>
          ))}

          {/* Ячейки календаря */}
          {timeSlots.map((timeSlot, timeIndex) =>
            daysToShow.map((day, dayIndex) => {
              const lesson = getLessonForSlot(day, timeSlot);
              const isWorkingHour = isInWorkingHours(timeSlot);
              const isFirstSlot = isFirstSlotOfLesson(day, timeSlot, lesson);
              const gridPosition = getLessonGridPosition(day, timeSlot, lesson);

              if (lesson && !isFirstSlot) {
                return null;
              }

              return (
                <TimeSlot
                  key={`slot-${dayIndex}-${timeIndex}`}
                  timeSlot={timeSlot}
                  day={day}
                  isWorkingHour={isWorkingHour}
                  lesson={lesson}
                  isFirstSlot={isFirstSlot}
                  gridPosition={
                    gridPosition || {
                      gridRow: timeIndex + 2,
                      gridColumn: dayIndex + 2,
                    }
                  }
                  onSlotClick={handleSlotClick}
                />
              );
            })
          )}
        </div>
      </div>

      <CalendarLegend />
    </div>
  );
};

export default CalendarSeptember25;
