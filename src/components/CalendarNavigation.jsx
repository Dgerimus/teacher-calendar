const CalendarNavigation = ({
  onNavigate,
  onToday,
  currentView,
  onViewChange,
  dateRangeTitle,
}) => {
  return (
    <>
      {/* Заголовок с диапазоном дат */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          {dateRangeTitle}
        </h3>
      </div>

      {/* Кнопки навигации */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {/* Кнопка "Назад" */}
            <button
              onClick={() => onNavigate("prev")}
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

            {/* Кнопка "Сегодня" */}
            <button
              onClick={onToday}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Сегодня
            </button>

            {/* Кнопка "Вперед" */}
            <button
              onClick={() => onNavigate("next")}
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

      {/* Переключение видов календаря */}
      <div className="flex gap-2 mb-6 justify-center">
        <button
          onClick={() => onViewChange("day")}
          className={`px-4 py-2 rounded-lg ${
            currentView === "day"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          День
        </button>

        <button
          onClick={() => onViewChange("three-day")}
          className={`px-4 py-2 rounded-lg ${
            currentView === "three-day"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          3 дня
        </button>

        <button
          onClick={() => onViewChange("week")}
          className={`px-4 py-2 rounded-lg ${
            currentView === "week"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Неделя
        </button>
      </div>
    </>
  );
};

export default CalendarNavigation;
