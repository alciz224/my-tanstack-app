import { Link, useRouterState } from '@tanstack/react-router'
import {
  Bell,
  BookOpen,
  Building2,
  Calendar,
  ClipboardCheck,
  Compass,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Map,
  MessageSquare,
  Settings,
  Shield,
  Users,
} from 'lucide-react'
import type { User } from '@/server/auth'
import type { UserRole } from '@/types/roles'
import { useTranslation } from '@/lib/i18n'

export interface NavItem {
  label: string
  labelKey?: string
  to?: string
  icon: React.ReactNode
  enabled?: boolean
}

interface NavSection {
  title: string
  titleKey?: string
  roles: Array<UserRole>
  items: Array<NavItem>
}

const navSections: Array<NavSection> = [
  {
    title: 'Plateforme',
    titleKey: 'nav.sectionPlatform',
    roles: ['super_admin'],
    items: [
      {
        label: 'Tableau de bord',
        labelKey: 'nav.dashboard',
        to: '/super-admin',
        icon: <LayoutDashboard className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Écoles',
        labelKey: 'nav.schools',
        to: '/super-admin/schools',
        icon: <Building2 className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Utilisateurs',
        labelKey: 'nav.users',
        to: '/super-admin/users',
        icon: <Users className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Configuration',
        labelKey: 'nav.configuration',
        to: '/super-admin/configuration',
        icon: <Settings className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Rapports',
        labelKey: 'nav.reports',
        to: '/super-admin/reports',
        icon: <FileText className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Géographie',
        labelKey: 'nav.geography',
        to: '/super-admin/geography',
        icon: <Map className="w-5 h-5" />,
        enabled: true,
      },
    ],
  },
  {
    title: 'Référentiel académique',
    titleKey: 'nav.sectionAcademicReference',
    roles: ['super_admin'],
    items: [
      {
        label: 'Academic Years',
        labelKey: 'nav.academicYears',
        to: '/super-admin/academic-years',
        icon: <Calendar className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Cycles',
        labelKey: 'nav.cycles',
        to: '/super-admin/cycles',
        icon: <Shield className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Levels',
        labelKey: 'nav.levels',
        to: '/super-admin/levels',
        icon: <GraduationCap className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Subjects',
        labelKey: 'nav.subjects',
        to: '/super-admin/subjects',
        icon: <BookOpen className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Profils / Séries',
        to: '/super-admin/tracks',
        icon: <Compass className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Périodes',
        labelKey: 'nav.periods',
        to: '/super-admin/periods',
        icon: <Calendar className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: "Types d'Évaluations",
        to: '/super-admin/assessment-types',
        icon: <ClipboardCheck className="w-5 h-5" />,
        enabled: true,
      },
    ],
  },
  {
    title: 'Établissement',
    titleKey: 'nav.sectionSchool',
    roles: ['school_admin'],
    items: [
      {
        label: 'Tableau de bord',
        labelKey: 'nav.dashboard',
        to: '/school-admin',
        icon: <LayoutDashboard className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Années Scolaires',
        labelKey: 'nav.schoolYears',
        to: '/school-admin/years',
        icon: <Building2 className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Enseignants',
        labelKey: 'nav.staff',
        to: '/school-admin/teachers',
        icon: <Users className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Élèves',
        labelKey: 'nav.students',
        to: '/school-admin/students',
        icon: <GraduationCap className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Parents / Tuteurs',
        labelKey: 'nav.parentsTutors',
        to: '/school-admin/parents',
        icon: <Users className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Classes',
        labelKey: 'nav.classes',
        to: '/school-admin/classrooms',
        icon: <Building2 className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Emplois du temps',
        labelKey: 'nav.schedule',
        to: '/school-admin/schedule',
        icon: <Calendar className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Évaluations',
        labelKey: 'nav.assessments',
        to: '/school-admin/assessments',
        icon: <FileText className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Finance',
        labelKey: 'nav.finance',
        to: '/school-admin/finance',
        icon: <CreditCard className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Rapports',
        labelKey: 'nav.reports',
        to: '/school-admin/reports',
        icon: <FileText className="w-5 h-5" />,
        enabled: true,
      },
    ],
  },
  {
    title: 'Administration',
    titleKey: 'nav.sectionAdmin',
    roles: ['admin'],
    items: [
      {
        label: 'Tableau de bord',
        labelKey: 'nav.dashboard',
        to: '/admin',
        icon: <LayoutDashboard className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Utilisateurs',
        labelKey: 'nav.users',
        to: '/admin/users',
        icon: <Users className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Paramètres',
        labelKey: 'nav.configuration',
        icon: <Settings className="w-5 h-5" />,
        enabled: false,
      },
      {
        label: 'Reports',
        labelKey: 'nav.reports',
        icon: <FileText className="w-5 h-5" />,
        enabled: false,
      },
    ],
  },
  {
    title: 'Enseignant',
    titleKey: 'nav.sectionTeacher',
    roles: ['teacher'],
    items: [
      {
        label: 'Tableau de bord',
        labelKey: 'nav.dashboard',
        to: '/teacher',
        icon: <LayoutDashboard className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Mes Classes',
        labelKey: 'nav.myClasses',
        to: '/teacher/classes',
        icon: <Users className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Mon Emploi du temps',
        to: '/teacher/schedule',
        icon: <Calendar className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Notes & Évaluations',
        to: '/teacher/grades',
        icon: <FileText className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Présences',
        labelKey: 'nav.attendance',
        icon: <ClipboardCheck className="w-5 h-5" />,
        enabled: false,
      },
      {
        label: 'Devoirs',
        labelKey: 'nav.homework',
        icon: <BookOpen className="w-5 h-5" />,
        enabled: false,
      },
      {
        label: 'Communications',
        labelKey: 'nav.communications',
        icon: <MessageSquare className="w-5 h-5" />,
        enabled: false,
      },
      {
        label: 'Ressources',
        labelKey: 'nav.resources',
        icon: <BookOpen className="w-5 h-5" />,
        enabled: false,
      },
    ],
  },
  {
    title: 'Étudiant',
    titleKey: 'nav.sectionStudent',
    roles: ['student'],
    items: [
      {
        label: 'Tableau de bord',
        labelKey: 'nav.dashboard',
        to: '/student',
        icon: <LayoutDashboard className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Mon Emploi du temps',
        labelKey: 'nav.timetable',
        to: '/student/schedule',
        icon: <Calendar className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Mes Notes',
        labelKey: 'nav.myGrades',
        to: '/student/grades',
        icon: <FileText className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Mes Bulletins',
        to: '/student/report-cards',
        icon: <FileText className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Présences',
        labelKey: 'nav.attendance',
        icon: <ClipboardCheck className="w-5 h-5" />,
        enabled: false,
      },
      {
        label: 'Devoirs',
        labelKey: 'nav.homework',
        icon: <BookOpen className="w-5 h-5" />,
        enabled: false,
      },
      {
        label: 'Communications',
        labelKey: 'nav.communications',
        icon: <MessageSquare className="w-5 h-5" />,
        enabled: false,
      },
      {
        label: 'Ressources',
        labelKey: 'nav.resources',
        icon: <BookOpen className="w-5 h-5" />,
        enabled: false,
      },
    ],
  },
  {
    title: 'Parent',
    titleKey: 'nav.sectionParent',
    roles: ['parent'],
    items: [
      {
        label: 'Tableau de bord',
        labelKey: 'nav.dashboard',
        to: '/parent',
        icon: <LayoutDashboard className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Mes Enfants',
        labelKey: 'nav.myChildren',
        to: '/parent/children',
        icon: <Users className="w-5 h-5" />,
        enabled: true,
      },
      {
        label: 'Scolarité',
        labelKey: 'nav.schooling',
        icon: <GraduationCap className="w-5 h-5" />,
        enabled: false,
      },
      {
        label: 'Finance',
        labelKey: 'nav.finance',
        icon: <CreditCard className="w-5 h-5" />,
        enabled: false,
      },
      {
        label: 'Communications',
        labelKey: 'nav.communications',
        icon: <MessageSquare className="w-5 h-5" />,
        enabled: false,
      },
      {
        label: 'Meetings',
        labelKey: 'nav.meetings',
        icon: <Bell className="w-5 h-5" />,
        enabled: false,
      },
    ],
  },
]

interface NavLinksProps {
  user: User | null
  onLinkClick?: () => void
  className?: string
}

export function NavLinks({ user, onLinkClick, className = '' }: NavLinksProps) {
  const { t } = useTranslation()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const role = user?.role
  if (!role) return null

  const sections = navSections.filter((section) => section.roles.includes(role))

  return (
    <nav className={`space-y-4 ${className}`}>
      {sections.map((section) => (
        <div key={section.title} className="space-y-1">
          <div className="px-3 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
            {section.titleKey
              ? t(section.titleKey as any) || section.title
              : section.title}
          </div>
          {section.items.map((item) => {
            const isActive = item.to
              ? currentPath === item.to || currentPath.startsWith(`${item.to}/`)
              : false
            const label = item.labelKey
              ? t(item.labelKey as any) || item.label
              : item.label

            if (item.enabled && item.to) {
              return (
                <Link
                  key={`${section.title}-${item.label}`}
                  to={item.to}
                  onClick={onLinkClick}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground/90 hover:text-foreground hover:bg-muted/70'
                  }`}
                >
                  {item.icon}
                  <span>{label}</span>
                </Link>
              )
            }

            return (
              <div
                key={`${section.title}-${item.label}`}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-foreground/70"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{label}</span>
                </div>
                <span className="text-[10px] uppercase tracking-wide bg-muted px-2 py-0.5 rounded-full">
                  {t('nav.comingSoon')}
                </span>
              </div>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
