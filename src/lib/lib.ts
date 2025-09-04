const generateCalendarDays = (date: Date): Date[] => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const previousMonthStart = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const previousMonthEnd = new Date(date.getFullYear(), date.getMonth(), 0);
    const currentMonthDays = generateDaysInMonth(firstDayOfMonth, lastDayOfMonth);
    const daysToFillBefore = firstDayOfMonth.getDay();
    const previousMonthDays = generateDaysInMonth(previousMonthStart, previousMonthEnd);
    const filledBefore = previousMonthDays.slice(-daysToFillBefore);
    const totalDays = filledBefore.length + currentMonthDays.length;
    const daysToFillAfter = 35 - totalDays; // Ajustamos a 35 días en total
    const nextMonthDays = generateDaysInMonth(
        new Date(date.getFullYear(), date.getMonth() + 1, 1),
        new Date(date.getFullYear(), date.getMonth() + 2, 0)
    );
    const filledAfter = nextMonthDays.slice(0, daysToFillAfter);
    return [...filledBefore, ...currentMonthDays, ...filledAfter].slice(0, 35); // Aseguramos que solo se generen 35 días
};

const generateDaysInMonth = (startDate: Date, endDate: Date): Date[] => {
    const daysArray: Date[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        daysArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return daysArray;
};

export { generateCalendarDays, generateDaysInMonth };