import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function generateStudentAvatar(
  firstName: string,
  lastName: string,
  gender: 'M' | 'F',
): string {
  const seed = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${gender}`
  const style = gender === 'F' ? 'avataaars' : 'avataaars'
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`
}
