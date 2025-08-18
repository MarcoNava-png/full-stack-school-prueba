export interface TeacherItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  speciality: string;
  joinDate: string;
  img: string;
  subjects: { name: string }[];
  classes: { name: string }[];
}