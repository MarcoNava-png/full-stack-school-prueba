"use client";

import FormModal from "./FormModal";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const mockTeachers = [
  { id: 1, name: "Ana", surname: "García" },
  { id: 2, name: "Luis", surname: "Hernández" },
];

const mockSubjects = [
  { id: 1, name: "Matemáticas" },
  { id: 2, name: "Historia" },
];

const mockGrades = [
  { id: 1, level: "1er Grado" },
  { id: 2, level: "2do Grado" },
];

const mockClasses = [
  { id: 1, name: "Clase A", _count: { students: 25 } },
  { id: 2, name: "Clase B", _count: { students: 22 } },
];

const mockLessons = [
  { id: 1, name: "Lección 1" },
  { id: 2, name: "Lección 2" },
];

interface FormContainerPropsWithCallback extends FormContainerProps {
  onSuccess?: (data: any) => void;
}

const FormContainer = ({ table, type, data, id, onSuccess }: FormContainerPropsWithCallback) => {
  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
      case "subject":
        relatedData = { teachers: mockTeachers };
        break;
      case "class":
        relatedData = { teachers: mockTeachers, grades: mockGrades };
        break;
      case "teacher":
        relatedData = { subjects: mockSubjects };
        break;
      case "student":
        relatedData = { classes: mockClasses, grades: mockGrades };
        break;
      case "exam":
        relatedData = { lessons: mockLessons };
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={typeof id === "string" ? Number(id) : id}
        relatedData={relatedData}
        onSuccess={onSuccess}
      />
    </div>
  );
};

export default FormContainer;
