import { createServerFn } from '@tanstack/react-start'
import type {
  Schedule,
  SchoolYearCycleTimeSlot,
} from '@/server/data/schedules/types'
import { getSchedulesService } from '@/server/data/schedules/factory'

export const getTimeSlotsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearCycleId: string) => schoolYearCycleId)
  .handler(
    async ({
      data: schoolYearCycleId,
    }): Promise<Array<SchoolYearCycleTimeSlot>> => {
      return getSchedulesService().getTimeSlots(schoolYearCycleId)
    },
  )

export const createTimeSlotFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<SchoolYearCycleTimeSlot, 'id'>) => data)
  .handler(async ({ data }): Promise<SchoolYearCycleTimeSlot> => {
    return getSchedulesService().createTimeSlot(data)
  })

export const updateTimeSlotFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string; updates: Partial<SchoolYearCycleTimeSlot> }) => data,
  )
  .handler(
    async ({ data: { id, updates } }): Promise<SchoolYearCycleTimeSlot> => {
      return getSchedulesService().updateTimeSlot(id, updates)
    },
  )

export const deleteTimeSlotFn = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<void> => {
    return getSchedulesService().deleteTimeSlot(id)
  })

export const getClassroomScheduleFn = createServerFn({ method: 'GET' })
  .inputValidator((classroomId: string) => classroomId)
  .handler(async ({ data: classroomId }): Promise<Array<Schedule>> => {
    return getSchedulesService().getClassroomSchedule(classroomId)
  })

export const getTeacherScheduleFn = createServerFn({ method: 'GET' })
  .inputValidator((teacherAssignmentId: string) => teacherAssignmentId)
  .handler(async ({ data: teacherAssignmentId }): Promise<Array<Schedule>> => {
    return getSchedulesService().getTeacherSchedule(teacherAssignmentId)
  })

export const createScheduleBlockFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<Schedule, 'id'>) => data)
  .handler(async ({ data }): Promise<Schedule> => {
    return getSchedulesService().createScheduleBlock(data)
  })

export const updateScheduleBlockFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<Schedule> }) => data)
  .handler(async ({ data: { id, updates } }): Promise<Schedule> => {
    return getSchedulesService().updateScheduleBlock(id, updates)
  })

export const deleteScheduleBlockFn = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<void> => {
    return getSchedulesService().deleteScheduleBlock(id)
  })
