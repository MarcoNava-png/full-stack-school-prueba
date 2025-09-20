/*"use client";

import { role } from "@/lib/data";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

 -------------------- Tipos -------------------- 
type BaseItem = {
  icon?: string;
  label: string;
  visible: string[];
};

type LeafItem = BaseItem & {
  href: string;
  children?: never;
};

type ParentItem = BaseItem & {
  href?: never;
  children: LeafItem[];
};

type Item = LeafItem | ParentItem;

// Type guard para distinguir padre vs hoja
function isParentItem(i: Item): i is ParentItem {
  return Array.isArray((i as ParentItem).children);
}

 -------------------- Menú -------------------- 
const menuItems: { title: string; items: Item[] }[] = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Inicio",
        href: "/dashboard",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/student.png",
        label: "Admisiones",
        href: "/dashboard/list/admissions",
        visible: ["admin"],
      },
      {
        icon: "/subject.png",
        label: "Inscripciones",
        href: "/dashboard/list/Inscripciones",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Estudiantes",
        href: "/dashboard/list/student",
        visible: ["admin", "teacher"],
      },

      // Submenú: Gestión Académica
      {
        icon: "/lesson.png",
        label: "Gestión Académica",
        visible: ["admin"], // agrega "teacher" si corresponde
        children: [
          {
            icon: "/lesson.png",
            label: "Ciclos Escolares",
            href: "/dashboard/list/schoolyears",
            visible: ["admin"],
          },
          {
            icon: "/subject.png",
            label: "Materias",
            href: "/dashboard/list/subjects",
            visible: ["admin"],
          },
          {
            icon: "/subject.png",
            label: "Grupos",
            href: "/dashboard/list/groups",
            visible: ["admin"],
          },
        ],
      },

      // Submenú: Gestión de Personal Académico
      {
        icon: "/teacher.png",
        label: "Gestión de Personal Académico",
        visible: ["admin"], // agrega "teacher" si corresponde
        children: [
          {
            icon: "/teacher.png",
            label: "Profesores",
            href: "/dashboard/list/teachers",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/student.png",
            label: "Coordinadores",
            href: "/dashboard/list/coordinators",
            visible: ["admin"],
          },
          {
            icon: "/subject.png",
            label: "Directores",
            href: "/dashboard/list/directors",
            visible: ["admin"],
          },
        ],
      },
      {
        icon: "/parent.png",
        label: "Padres",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/class.png",
        label: "Clases",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Lecciones",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/exam.png",
        label: "Examenes",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Asignaciones",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "Resultados",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/attendance.png",
        label: "Asistencia",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Eventos",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/message.png",
        label: "Mensajes",
        href: "/list/messages",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Anuncios",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

 -------------------- Componente -------------------- 
const Sidebar = () => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href || pathname === "/";
    }
    return pathname === href || (pathname.startsWith(`${href}/`) && href !== "/");
  };

  const isParentActive = (i: Item) =>
    isParentItem(i) && i.children.some((c) => isActive(c.href));

  // Abre automáticamente los submenús que contienen la ruta actual
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach((section) => {
      section.items.forEach((item) => {
        if (isParentItem(item) && item.visible.includes(role)) {
          initial[item.label] = isParentActive(item);
        }
      });
    });
    setOpenSections((prev) => ({ ...prev, ...initial }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleSection = (label: string) =>
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));

  const Caret = ({ open }: { open: boolean }) => (
    <svg
      className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : "rotate-0")}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className={`h-full overflow-y-auto ${isMobile ? "px-1" : "pr-2"}`}>
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>

      <div className={`space-y-1 ${isMobile ? "px-1" : "px-2"}`}>
        {menuItems.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isMobile && (
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const isVisible = isParentItem(item)
                  ? item.visible.includes(role) &&
                    item.children.some((c) => c.visible.includes(role))
                  : item.visible.includes(role);

                if (!isVisible) return null;

                const iconSize = isMobile ? 20 : 16;

                // Padre (submenu)
                if (isParentItem(item)) {
                  const open = !!openSections[item.label];
                  const parentActive = isParentActive(item);

                  return (
                    <div key={item.label} className="relative group">
                      <button
                        type="button"
                        onClick={() => toggleSection(item.label)}
                        className={cn(
                          "w-full flex items-center gap-2 py-2.5 px-3 text-sm font-medium rounded-lg transition-colors text-left",
                          isMobile ? "justify-center" : "justify-start",
                          parentActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                        aria-expanded={open}
                        aria-controls={`submenu-${item.label}`}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center rounded-lg transition-colors",
                            isMobile ? "p-2" : "p-1.5 mr-1.5",
                            parentActive
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                          )}
                        >
                          <Image
                            src={item.icon || "/folder.png"}
                            alt={item.label}
                            width={iconSize}
                            height={iconSize}
                            className={isMobile ? "w-5 h-5" : "w-4 h-4"}
                          />
                        </div>
                        {!isMobile && (
                          <span className="flex-1 whitespace-normal break-words leading-snug pr-2">
                            {item.label}
                          </span>
                        )}
                        {!isMobile && <Caret open={open} />}
                      </button>

                      
                      <div
                        id={`submenu-${item.label}`}
                        className={cn(
                          "pl-5 overflow-hidden transition-[max-height] duration-300",
                          open ? "max-h-96" : "max-h-0"
                        )}
                      >
                        <div className="mt-1 space-y-1">
                          {item.children
                            .filter((c) => c.visible.includes(role))
                            .map((child) => {
                              const active = isActive(child.href);
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={cn(
                                    "flex items-center py-2 px-3 text-sm rounded-lg transition-colors",
                                    active
                                      ? "bg-blue-50 text-blue-700"
                                      : "text-gray-600 hover:bg-gray-100"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "mr-2 h-1.5 w-1.5 rounded-full",
                                      active ? "bg-blue-600" : "bg-gray-300"
                                    )}
                                  />
                                  <span className="whitespace-normal break-words leading-snug">
                                    {child.label}
                                  </span>
                                </Link>
                              );
                            })}
                        </div>
                      </div>

                      {isMobile && (
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded py-1.5 px-2.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                          {item.label}
                        </div>
                      )}
                    </div>
                  );
                }

                // Hoja (link normal)
                const active = isActive(item.href);
                return (
                  <div key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center py-2.5 px-3 text-sm font-medium rounded-lg transition-colors",
                        isMobile ? "justify-center" : "justify-start",
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-lg transition-colors",
                          isMobile ? "p-2" : "p-1.5 mr-3",
                          active
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                        )}
                      >
                        <Image
                          src={item.icon || "/dot.png"}
                          alt={item.label}
                          width={iconSize}
                          height={iconSize}
                          className={isMobile ? "w-5 h-5" : "w-4 h-4"}
                        />
                      </div>
                      {!isMobile && (
                        <span className="whitespace-normal break-words leading-snug">
                          {item.label}
                        </span>
                      )}
                    </Link>

                    {isMobile && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded py-1.5 px-2.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
*/

"use client";

import { role } from "@/lib/data";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/* -------------------- Tipos -------------------- */
type BaseItem = {
  icon?: string;
  label: string;
  visible: string[];
};

type LeafItem = BaseItem & {
  href: string;
  children?: never;
};

type ParentItem = BaseItem & {
  href?: never;
  children: LeafItem[];
};

type Item = LeafItem | ParentItem;

// Type guard
function isParentItem(i: Item): i is ParentItem {
  return Array.isArray((i as ParentItem).children);
}

/* -------------------- Menú agrupado por módulos -------------------- */
const menuItems: { title: string; items: Item[] }[] = [
  {
    title: "MENU",
    items: [
      /* --- Inicio --- */
      {
        icon: "/home.png",
        label: "Inicio",
        href: "/dashboard",
        visible: ["admin", "teacher", "student", "parent"],
      },

      /* --- Admisiones --- */
      {
        icon: "/student.png",
        label: "Admisiones",
        visible: ["admin"],
        children: [
          {
            icon: "/student.png",
            label: "Aspirantes",
            href: "/dashboard/list/admissions",
            visible: ["admin"],
          },

          {
            icon: "/student.png",
            label: "Seguimiento Aspirantes",
            href: "/dashboard/list/admissions/detailsapplicants",
            visible: ["admin"],
          }
        ],
      },

      /* --- Inscripciones --- */
      {
        icon: "/subject.png",
        label: "Inscripciones",
        visible: ["admin", "teacher"],
        children: [
          {
            icon: "/subject.png",
            label: "Inscribir aspirante",
            href: "/dashboard/list/Inscripciones",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/subject.png",
            label: "Reinscripciones",
            href: "/dashboard/enrollments/re",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/subject.png",
            label: "Cambios de grupo/plan",
            href: "/dashboard/enrollments/changes",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/subject.png",
            label: "Becas y descuentos",
            href: "/dashboard/enrollments/benefits",
            visible: ["admin"],
          },
          {
            icon: "/settings.png",
            label: "Configuración de Inscripciones",
            href: "/dashboard/settings/enrollment",
            visible: ["admin"],
          },
        ],
      },

      /* --- Operación Escolar --- */
      {
        icon: "/attendance.png",
        label: "Operación Escolar",
        visible: ["admin", "teacher"],
        children: [
          {
            icon: "/attendance.png",
            label: "Asistencias",
            href: "/list/attendance",
            visible: ["admin", "teacher", "student", "parent"],
          },
          {
            icon: "/class.png",
            label: "Cargas académicas",
            href: "/dashboard/operations/course-enrollments",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/class.png",
            label: "Movimientos escolares",
            href: "/dashboard/operations/movements",
            visible: ["admin"],
          },
          {
            icon: "/class.png",
            label: "Constancias / Certificados",
            href: "/dashboard/operations/certificates",
            visible: ["admin"],
          },
          {
            icon: "/settings.png",
            label: "Config. Operación",
            href: "/dashboard/settings/operations",
            visible: ["admin"],
          },
        ],
      },

      /* --- Gestión Académica --- */
      {
        icon: "/lesson.png",
        label: "Gestión Académica",
        visible: ["admin", "teacher"],
        children: [
          {
            icon: "/lesson.png",
            label: "Ciclos escolares",
            href: "/dashboard/list/schoolyears",
            visible: ["admin"],
          },
          {
            icon: "/lesson.png",
            label: "Campus / Sedes",
            href: "/dashboard/list/campuses",
            visible: ["admin"],
          },
          {
            icon: "/lesson.png",
            label: "Planes de estudio",
            href: "/dashboard/list/programs",
            visible: ["admin"],
          },
          {
            icon: "/subject.png",
            label: "Materias",
            href: "/dashboard/list/subjects",
            visible: ["admin"],
          },
          {
            icon: "/lesson.png",
            label: "Horarios",
            href: "/dashboard/list/schedules",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/subject.png",
            label: "Grupos",
            href: "/dashboard/list/groups",
            visible: ["admin"],
          },
          {
            icon: "/settings.png",
            label: "Config. Académica",
            href: "/dashboard/settings/academics",
            visible: ["admin"],
          },
        ],
      },

      /* --- Evaluación Académica --- */
      {
        icon: "/exam.png",
        label: "Evaluación Académica",
        visible: ["admin", "teacher", "student", "parent"],
        children: [
          {
            icon: "/exam.png",
            label: "Exámenes",
            href: "/list/exams",
            visible: ["admin", "teacher", "student", "parent"],
          },
          {
            icon: "/result.png",
            label: "Calificaciones",
            href: "/dashboard/academics/grades",
            visible: ["admin", "teacher", "student", "parent"],
          },
          {
            icon: "/lesson.png",
            label: "Periodos de evaluación",
            href: "/dashboard/academics/terms",
            visible: ["admin"],
          },
          {
            icon: "/result.png",
            label: "Actas / Cierre",
            href: "/dashboard/academics/gradebooks",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/result.png",
            label: "Kardex / Historial",
            href: "/dashboard/academics/transcripts",
            visible: ["admin", "teacher", "student", "parent"],
          },
          {
            icon: "/settings.png",
            label: "Config. de Evaluación",
            href: "/dashboard/settings/grading",
            visible: ["admin"],
          },
        ],
      },

      /* --- Gestión de Personal Académico --- */
      {
        icon: "/teacher.png",
        label: "Gestión de Personal Académico",
        visible: ["admin", "teacher"],
        children: [
          {
            icon: "/teacher.png",
            label: "Profesores",
            href: "/dashboard/list/teachers",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/student.png",
            label: "Coordinadores",
            href: "/dashboard/list/coordinators",
            visible: ["admin"],
          },
          {
            icon: "/class.png",
            label: "Asignación de carga",
            href: "/dashboard/staff/teaching-load",
            visible: ["admin"],
          },
          {
            icon: "/settings.png",
            label: "Config. de Personal",
            href: "/dashboard/settings/staff",
            visible: ["admin"],
          },
        ],
      },

      /* --- Comunidad & Comunicación --- */
      {
        icon: "/message.png",
        label: "Comunidad & Comunicación",
        visible: ["admin", "teacher", "student", "parent"],
        children: [
          {
            icon: "/student.png",
            label: "Estudiantes",
            href: "/dashboard/list/student",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/parent.png",
            label: "Padres / Tutores",
            href: "/list/parents",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/message.png",
            label: "Mensajes",
            href: "/list/messages",
            visible: ["admin", "teacher", "student", "parent"],
          },
          {
            icon: "/announcement.png",
            label: "Anuncios",
            href: "/list/announcements",
            visible: ["admin", "teacher", "student", "parent"],
          },
          {
            icon: "/calendar.png",
            label: "Eventos",
            href: "/list/events",
            visible: ["admin", "teacher", "student", "parent"],
          },
          {
            icon: "/settings.png",
            label: "Config. de Comunicación",
            href: "/dashboard/settings/comms",
            visible: ["admin"],
          },
        ],
      },

      /* --- Reportes --- */
      {
        icon: "/result.png",
        label: "Reportes",
        visible: ["admin", "teacher"],
        children: [
          {
            icon: "/result.png",
            label: "Inscritos por ciclo/plan/grupo",
            href: "/dashboard/reports/enrollments",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/result.png",
            label: "Reprobación y eficiencia",
            href: "/dashboard/reports/grades",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/result.png",
            label: "Ocupación de aulas / choques",
            href: "/dashboard/reports/rooms",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/result.png",
            label: "Avance de captura",
            href: "/dashboard/reports/progress",
            visible: ["admin", "teacher"],
          },
        ],
      },
    ],
  },
];

/* -------------------- Componente -------------------- */
const Sidebar = () => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href || pathname === "/";
    }
    return pathname === href || (pathname.startsWith(`${href}/`) && href !== "/");
  };

  const isParentActive = (i: Item) =>
    isParentItem(i) && i.children.some((c) => isActive(c.href));

  // Abrir automáticamente submenús que contengan la ruta activa
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach((section) => {
      section.items.forEach((item) => {
        if (isParentItem(item) && item.visible.includes(role)) {
          initial[item.label] = isParentActive(item);
        }
      });
    });
    setOpenSections((prev) => ({ ...prev, ...initial }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleSection = (label: string) =>
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));

  const Caret = ({ open }: { open: boolean }) => (
    <svg
      className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : "rotate-0")}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className={`h-full overflow-y-auto ${isMobile ? "px-1" : "pr-2"}`}>
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>

      <div className={`space-y-1 ${isMobile ? "px-1" : "px-2"}`}>
        {menuItems.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isMobile && (
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                // Visibilidad por rol
                const isVisible = isParentItem(item)
                  ? item.visible.includes(role) &&
                    item.children.some((c) => c.visible.includes(role))
                  : item.visible.includes(role);

                if (!isVisible) return null;

                const iconSize = isMobile ? 20 : 16;

                // Padre con submenu
                if (isParentItem(item)) {
                  const open = !!openSections[item.label];
                  const parentActive = isParentActive(item);

                  return (
                    <div key={item.label} className="relative group">
                      <button
                        type="button"
                        onClick={() => toggleSection(item.label)}
                        className={cn(
                          "w-full flex items-center gap-2 py-2.5 px-3 text-sm font-medium rounded-lg transition-colors text-left",
                          isMobile ? "justify-center" : "justify-start",
                          parentActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                        aria-expanded={open}
                        aria-controls={`submenu-${item.label}`}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center rounded-lg transition-colors",
                            isMobile ? "p-2" : "p-1.5 mr-1.5",
                            parentActive
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                          )}
                        >
                          <Image
                            src={item.icon || "/folder.png"}
                            alt={item.label}
                            width={iconSize}
                            height={iconSize}
                            className={isMobile ? "w-5 h-5" : "w-4 h-4"}
                          />
                        </div>
                        {!isMobile && (
                          <span className="flex-1 whitespace-normal break-words leading-snug pr-2">
                            {item.label}
                          </span>
                        )}
                        {!isMobile && <Caret open={open} />}
                      </button>

                      {/* Subitems */}
                      <div
                        id={`submenu-${item.label}`}
                        className={cn(
                          "pl-5 overflow-hidden transition-[max-height] duration-300",
                          open ? "max-h-96" : "max-h-0"
                        )}
                      >
                        <div className="mt-1 space-y-1">
                          {item.children
                            .filter((c) => c.visible.includes(role))
                            .map((child) => {
                              const active = isActive(child.href);
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={cn(
                                    "flex items-center py-2 px-3 text-sm rounded-lg transition-colors",
                                    active
                                      ? "bg-blue-50 text-blue-700"
                                      : "text-gray-600 hover:bg-gray-100"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "mr-2 h-1.5 w-1.5 rounded-full",
                                      active ? "bg-blue-600" : "bg-gray-300"
                                    )}
                                  />
                                  <span className="whitespace-normal break-words leading-snug">
                                    {child.label}
                                  </span>
                                </Link>
                              );
                            })}
                        </div>
                      </div>

                      {isMobile && (
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded py-1.5 px-2.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                          {item.label}
                        </div>
                      )}
                    </div>
                  );
                }

                // Hoja (link normal)
                const active = isActive(item.href);
                return (
                  <div key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center py-2.5 px-3 text-sm font-medium rounded-lg transition-colors",
                        isMobile ? "justify-center" : "justify-start",
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-lg transition-colors",
                          isMobile ? "p-2" : "p-1.5 mr-3",
                          active
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                        )}
                      >
                        <Image
                          src={item.icon || "/dot.png"}
                          alt={item.label}
                          width={iconSize}
                          height={iconSize}
                          className={isMobile ? "w-5 h-5" : "w-4 h-4"}
                        />
                      </div>
                      {!isMobile && (
                        <span className="whitespace-normal break-words leading-snug">
                          {item.label}
                        </span>
                      )}
                    </Link>

                    {isMobile && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded py-1.5 px-2.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
