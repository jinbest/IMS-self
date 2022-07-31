export type GenderParam = "M" | "F"

export interface MemberParam {
  _id: string
  fullname: string
  email: string
  gender: GenderParam
  birthday: string
  job: string
  address: string
}
