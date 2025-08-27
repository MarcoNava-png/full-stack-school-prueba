import { Coordinator } from "./Coordinator"

export interface CoordinatorResponse {
  items: Coordinator[],
  totalItems: number,
  pageNumber: number,
  pageSize: number,
  totalPages: number
}
