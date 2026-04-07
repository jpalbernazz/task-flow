import { useCallback, useMemo, useState, type KeyboardEvent } from "react"
import { getErrorMessage } from "@/lib/get-error-message"
import {
  MONTHS,
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

function clampDay(day: number, daysInMonth: number): number {
  return Math.min(daysInMonth, Math.max(1, day))
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
  const monthLabel = useMemo(() => `${MONTHS[month]} ${year}`, [month, year])

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

  const selectDay = useCallback(
    (day: number) => {
      if (day < 1 || day > daysInMonth) {
        return
      }

      setSelectedDay(day)
    },
    [daysInMonth],
  )

  const handleDayKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, day: number): number | null => {
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        event.preventDefault()
        setSelectedDay(day)
        return day
      }

      let nextDay = day

      if (event.key === "ArrowLeft") {
        event.preventDefault()
        nextDay = clampDay(day - 1, daysInMonth)
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        nextDay = clampDay(day + 1, daysInMonth)
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
        nextDay = clampDay(day - 7, daysInMonth)
      } else if (event.key === "ArrowDown") {
        event.preventDefault()
        nextDay = clampDay(day + 7, daysInMonth)
      } else if (event.key === "Home") {
        event.preventDefault()
        nextDay = 1
      } else if (event.key === "End") {
        event.preventDefault()
        nextDay = daysInMonth
      } else {
        return null
      }

      setSelectedDay(nextDay)
      return nextDay
    },
    [daysInMonth],
  )

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

  const calendarUiState = useMemo(() => {
    const hasTasks = calendarTasks.length > 0
    const hasTasksInMonth = monthSummary.tasksInMonth > 0
    const hasError = errorMessage !== null

    return {
      hasTasks,
      hasTasksInMonth,
      isGlobalEmpty: !isRefreshing && !hasError && !hasTasks,
      isMonthEmpty: !isRefreshing && !hasError && hasTasks && !hasTasksInMonth,
    }
  }, [calendarTasks.length, monthSummary.tasksInMonth, errorMessage, isRefreshing])

  return {
    year,
    month,
    monthLabel,
    todayContext,
    calendarTasks,
    selectedDay,
    setSelectedDay,
    selectDay,
    handleDayKeyDown,
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
    calendarUiState,
  }
}
