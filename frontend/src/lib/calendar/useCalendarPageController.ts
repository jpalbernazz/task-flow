import { useCallback, useMemo, useState } from "react"
import { getErrorMessage } from "@/lib/get-error-message"
import {
  buildCalendarDays,
  buildTasksByDateMap,
  formatDateLabel,
  getDateKey,
  getMonthContext,
  getMonthSummary,
  getTasksForDay,
  getTodayDateKey,
  getUpcomingDeadlines,
} from "@/lib/calendar/calendar-utils"
import type { CalendarTask } from "@/lib/calendar/types"
import { getCalendarTasks } from "@/services/calendar-service"

interface UseCalendarPageControllerParams {
  initialTasks: CalendarTask[]
  initialError?: string | null
}

export function useCalendarPageController({
  initialTasks,
  initialError = null,
}: UseCalendarPageControllerParams) {
  const [today] = useState(() => new Date())
  const [currentDate, setCurrentDate] = useState(() => {
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [calendarTasks, setCalendarTasks] = useState<CalendarTask[]>(initialTasks)
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError)
  const [infoMessage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const todayContext = useMemo(
    () => ({
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    }),
    [today],
  )

  const todayDateKey = useMemo(() => getTodayDateKey(today), [today])

  const { year, month, startingDayOfWeek, daysInMonth } = useMemo(() => {
    return getMonthContext(currentDate)
  }, [currentDate])

  const refreshCalendarTasks = useCallback(async () => {
    setIsRefreshing(true)
    setErrorMessage(null)

    try {
      const tasks = await getCalendarTasks()
      setCalendarTasks(tasks)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Não foi possível carregar as tarefas do calendário."))
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  const prevMonth = useCallback(() => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDay(null)
  }, [year, month])

  const nextMonth = useCallback(() => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDay(null)
  }, [year, month])

  const goToToday = useCallback(() => {
    setCurrentDate(new Date(todayContext.year, todayContext.month, 1))
    setSelectedDay(todayContext.day)
  }, [todayContext])

  const tasksByDate = useMemo(() => buildTasksByDateMap(calendarTasks), [calendarTasks])

  const calendarDays = useMemo(() => {
    return buildCalendarDays(startingDayOfWeek, daysInMonth)
  }, [startingDayOfWeek, daysInMonth])

  const monthSummary = useMemo(() => {
    return getMonthSummary(calendarTasks, tasksByDate, year, month, todayDateKey)
  }, [calendarTasks, tasksByDate, year, month, todayDateKey])

  const upcomingDeadlines = useMemo(() => getUpcomingDeadlines(calendarTasks, 3), [calendarTasks])

  const selectedDayTasks = useMemo(() => {
    if (selectedDay === null) {
      return []
    }

    return getTasksForDay(tasksByDate, year, month, selectedDay)
  }, [month, selectedDay, tasksByDate, year])

  const selectedDateKey = useMemo(() => {
    if (selectedDay === null) {
      return null
    }

    return getDateKey(year, month, selectedDay)
  }, [month, selectedDay, year])

  const selectedDateLabel = useMemo(() => {
    if (selectedDateKey === null) {
      return null
    }

    return formatDateLabel(selectedDateKey)
  }, [selectedDateKey])

  const viewState = useMemo(
    () => ({
      hasError: errorMessage !== null,
      hasInfo: infoMessage !== null,
      isRefreshing,
    }),
    [errorMessage, infoMessage, isRefreshing],
  )

  return {
    year,
    month,
    todayContext,
    calendarTasks,
    selectedDay,
    setSelectedDay,
    errorMessage,
    infoMessage,
    isRefreshing,
    refreshCalendarTasks,
    prevMonth,
    nextMonth,
    goToToday,
    tasksByDate,
    calendarDays,
    monthSummary,
    upcomingDeadlines,
    selectedDayTasks,
    selectedDateLabel,
    viewState,
  }
}
