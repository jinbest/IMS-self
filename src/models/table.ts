import { MemberParam } from "./member"

export type OrderParam = "asc" | "desc"

export interface HeadCellParam {
  disablePadding: boolean
  id: keyof MemberParam
  label: string
  numeric: boolean
}
