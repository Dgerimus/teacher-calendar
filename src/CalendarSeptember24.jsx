import { useState, useEffect } from "react";

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
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      case "three-day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 3 : -3));
        break;
      case "week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      default:
        break;
    }

    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date(2025, 8, 1));
  };

  // Генерация временных слотов (30 минут)
  const timeSlots = Array.from({ length: 28 }, (_, i) => {
    const hours = Math.floor(i / 2) + 8;
    const minutes = (i % 2) * 30;
    return { hours, minutes, index: i };
  });

  // Получение дней для отображения
  const getDaysToShow = () => {
    const startDate = new Date(selectedDate);

    switch (currentView) {
      case "day":
        return [startDate];
      case "three-day":
        return Array.from({ length: 3 }, (_, i) => {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          return date;
        });
      case "week":
        const monday = new Date(startDate);
        const dayOfWeek = monday.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        monday.setDate(monday.getDate() + diff);

        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(monday);
          date.setDate(monday.getDate() + i);
          return date;
        });
      default:
        return [startDate];
    }
  };

  const daysToShow = getDaysToShow();

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

    const lessonDate = new Date(lesson.date);
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

  // Проверка рабочего времени
  const isInWorkingHours = (timeSlot) => {
    const totalMinutes = timeSlot.hours * 60 + timeSlot.minutes;
    return totalMinutes >= 9 * 60 && totalMinutes < 18 * 60;
  };

  // Форматирование даты
  const formatDate = (date) => {
    return date.toLocaleDateString("ru-RU", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const getDateRangeTitle = () => {
    if (daysToShow.length === 0) return "";

    if (daysToShow.length === 1) {
      return daysToShow[0].toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    const firstDate = daysToShow[0];
    const lastDate = daysToShow[daysToShow.length - 1];

    if (firstDate.getMonth() === lastDate.getMonth()) {
      return `${firstDate.getDate()} - ${lastDate.getDate()} ${firstDate.toLocaleDateString(
        "ru-RU",
        { month: "long" }
      )} ${firstDate.getFullYear()}`;
    } else {
      return `${firstDate.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
      })} - ${lastDate.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Отображаемый диапазон дат */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          {getDateRangeTitle()}
        </h3>
      </div>
      {/* Заголовок с навигацией */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => navigatePeriod("prev")}
              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              aria-label="Предыдущий период"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Сегодня
            </button>

            <button
              onClick={() => navigatePeriod("next")}
              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              aria-label="Следующий период"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Переключение видов */}
      <div className="flex gap-2 mb-6 justify-center">
        <button
          onClick={() => setCurrentView("day")}
          className={`px-4 py-2 rounded-lg ${
            currentView === "day"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          День
        </button>
        <button
          onClick={() => setCurrentView("three-day")}
          className={`px-4 py-2 rounded-lg ${
            currentView === "three-day"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          3 дня
        </button>
        <button
          onClick={() => setCurrentView("week")}
          className={`px-4 py-2 rounded-lg ${
            currentView === "week"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Неделя
        </button>
      </div>

      {/* Календарь */}
      <div className="overflow-x-auto">
        <div
          className="grid gap-1 min-w-max relative"
          style={{
            gridTemplateColumns: `110px repeat(${daysToShow.length}, 110px)`,
          }}
        >
          {/* Заголовок с временами */}
          <div className="bg-gray-100 p-2 rounded text-center font-semibold">
            Время
          </div>
          {daysToShow.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="bg-gray-100 p-2 rounded text-center font-semibold"
            >
              {formatDate(day)}
            </div>
          ))}

          {/* Слоты времени */}
          {timeSlots.map((timeSlot, timeIndex) => (
            <>
              <div
                key={`time-${timeIndex}`}
                className="bg-gray-50 p-2 text-xs text-gray-600 text-center "
              >
                {`${timeSlot.hours
                  .toString()
                  .padStart(2, "0")}:${timeSlot.minutes
                  .toString()
                  .padStart(2, "0")}`}
              </div>

              {daysToShow.map((day, dayIndex) => {
                const lesson = getLessonForSlot(day, timeSlot);
                const isWorkingHour = isInWorkingHours(timeSlot);
                const isFirstSlot = isFirstSlotOfLesson(day, timeSlot, lesson);
                const gridPosition = getLessonGridPosition(
                  day,
                  timeSlot,
                  lesson
                );

                // Если это не первый слот занятия, не рендерим ячейку (занятие будет растянуто)
                if (lesson && !isFirstSlot) {
                  return null;
                }

                // Определяем скругление углов
                const getBorderRadius = () => {
                  if (!lesson) return "";
                  if (isFirstSlot) {
                    return "rounded-lg";
                  }
                  return "";
                };

                return (
                  <div
                    key={`slot-${dayIndex}-${timeIndex}`}
                    onClick={() =>
                      isWorkingHour && handleSlotClick(day, timeSlot)
                    }
                    className={`
                      p-1 border min-h-[40px] transition-colors relative
                      flex items-center justify-center
                      ${
                        lesson
                          ? "bg-red-200 hover:bg-red-300 cursor-pointer"
                          : isWorkingHour
                          ? "bg-green-100 hover:bg-green-200 cursor-pointer"
                          : "bg-gray-50 cursor-not-allowed"
                      }
                      ${getBorderRadius()}
                    `}
                    style={{
                      gridRow: gridPosition?.gridRow || timeIndex + 2,
                      gridColumn: gridPosition?.gridColumn || dayIndex + 2,
                    }}
                  >
                    {isFirstSlot && (
                      <div className="text-xs text-center leading-tight">
                        <div className="font-semibold truncate max-w-[80px]">
                          {lesson.title}
                        </div>
                        <div className="text-gray-600 text-[11px] mt-0.5">
                          {lesson.duration} мин
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Легенда */}
      <div className="mt-6 flex gap-4 text-sm justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 rounded"></div>
          <span>Занятие</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 rounded"></div>
          <span>Свободный слот</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-50 rounded"></div>
          <span>Не рабочее время</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarSeptember25;
