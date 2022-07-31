import axios from "axios"

export default class ApiClient {
  private static instance: ApiClient

  private constructor() {
    //EMPTY
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }

    return ApiClient.instance
  }

  async get<T>(url: string, options: Record<string, any> = {}): Promise<T> {
    return (
      await axios.get(url, {
        params: {
          ...(options != null ? options : {}),
        },
      })
    ).data as T
  }

  async post<T>(
    url: string,
    body?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<T> {
    return (
      await axios.post(url, body, {
        params: {
          ...(options != null ? options : {}),
        },
      })
    ).data as T
  }

  async put<T>(url: string, body?: Record<string, any>, options?: Record<string, any>): Promise<T> {
    return (
      await axios.put(url, body, {
        params: {
          ...(options != null ? options : {}),
        },
      })
    ).data as T
  }

  async patch<T>(
    url: string,
    body?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<T> {
    return (
      await axios.patch(url, body, {
        params: {
          ...(options != null ? options : {}),
        },
      })
    ).data as T
  }

  async delete<T>(url: string, options?: Record<string, any>): Promise<T> {
    return (
      await axios.delete(url, {
        params: {
          ...(options != null ? options : {}),
        },
      })
    ).data as T
  }
}
