import { MOCK_STUDENTS } from '../students/mocks'
import type { Parent } from './types'

export const mockParents: Array<Parent> = (() => {
  const parentMap = new Map<string, Array<Parent['children'][0]>>()

  MOCK_STUDENTS.forEach((student) => {
    if (student.parent_name) {
      const parentKey = student.parent_name.toLowerCase()
      if (!parentMap.has(parentKey)) {
        parentMap.set(parentKey, [])
      }
      parentMap.get(parentKey)!.push({
        id: student.id,
        full_name: student.full_name,
        class_name: student.class_name,
        level: student.level,
        academic_year: student.academic_year,
        enrollment_status: student.enrollment_status,
      })
    }
  })

  return MOCK_STUDENTS.filter((s) => s.parent_name)
    .map((student, index) => {
      const parentKey = student.parent_name!.toLowerCase()
      const children = parentMap.get(parentKey) || []
      const uniqueChildren = children.filter(
        (c, i, arr) => arr.findIndex((x) => x.id === c.id) === i,
      )

      return {
        id: `parent-${index + 1}`,
        full_name: student.parent_name!,
        email: student.parent_email,
        phone: student.parent_phone,
        address: student.address,
        children_count: uniqueChildren.length,
        children: uniqueChildren,
      }
    })
    .filter(
      (p, i, arr) => arr.findIndex((x) => x.full_name === p.full_name) === i,
    )
})()

export type { Parent } from './types'
