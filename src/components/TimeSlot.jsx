const TimeSlot = ({
  timeSlot,
  day,
  isWorkingHour,
  lesson,
  isFirstSlot,
  gridPosition,
  onSlotClick,
}) => {
  // Определяем скругление углов только для первого слота занятия
  const getBorderRadius = () => {
    if (!lesson) return "";
    if (isFirstSlot) return "rounded-lg";
    return "";
  };

  // Определяем классы в зависимости от типа слота
  const getSlotClasses = () => {
    if (lesson) {
      return "bg-red-200 hover:bg-red-300 cursor-pointer";
    } else if (isWorkingHour) {
      return "bg-green-100 hover:bg-green-200 cursor-pointer";
    } else {
      return "bg-gray-50 cursor-not-allowed";
    }
  };

  // Функция для форматирования времени занятия
  const getLessonTimeRange = () => {
    if (!lesson) return "";

    const startTime = new Date(lesson.startTime);
    const endTime = new Date(lesson.endTime);

    return `${startTime.getHours()}:${startTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}-${endTime.getHours()}:${endTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  // Сокращаем длинное имя студента
  const getShortStudentName = (name) => {
    if (name.length <= 12) return name;
    return name.split(" ")[0]; // Берем только имя
  };

  return (
    <div
      onClick={() => isWorkingHour && onSlotClick(day, timeSlot)}
      className={`
        p-1 border min-h-[40px] transition-colors relative
        flex items-center justify-center
        ${getSlotClasses()}
        ${getBorderRadius()}
      `}
      style={gridPosition}
    >
      {/* Показываем информацию только для первого слота занятия */}
      {isFirstSlot && (
        <div className="text-xs text-center leading-tight w-full px-1">
          <div className="font-semibold truncate">
            {getShortStudentName(lesson.student)}
          </div>
          <div className="text-gray-600 text-[10px] mt-0.5 truncate">
            {getLessonTimeRange()}({lesson.duration} мин)
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlot;
