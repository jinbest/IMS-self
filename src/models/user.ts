export interface UserParam {
  username: string
  email: string
  isAdmin: boolean
  avatar?: string
  phone?: string
  address?: string
  career?: string
  about?: string
  birthday?: string
  gender?: string
}

export interface LoginParam {
  username: string
  password: string
}

export interface LoginResParam {
  success: boolean
  message?: string
  isAdmin?: boolean
  email?: string
  avatar?: string
  phone?: string
  address?: string
  career?: string
  about?: string
  birthday?: string
  gender?: string
}

export interface RegisterParam {
  username: string
  email: string
  password: string
}

export interface RegisterResParam {
  success: boolean
  message?: string
  isAdmin?: boolean
}
