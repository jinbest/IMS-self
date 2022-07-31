import axios, { AxiosResponse } from "axios"

export default class AuthenticatedApiClient {
  private static instance: AuthenticatedApiClient

  private constructor() {
    //EMPTY
  }

  public static getInstance(): AuthenticatedApiClient {
    if (!AuthenticatedApiClient.instance) {
      AuthenticatedApiClient.instance = new AuthenticatedApiClient()
    }

    return AuthenticatedApiClient.instance
  }

  async head(url: string, options: Record<string, any> = {}): Promise<AxiosResponse> {
    const authorization = await this.getCurrentUserAuthorization()
    const data = await axios.head(url, {
      headers: {
        Authorization: authorization,
      },
      params: {
        ...(options != null ? options : {}),
      },
    })
    return data
  }

  async get<T>(url: string, options: Record<string, any> = {}): Promise<T> {
    const authorization = await this.getCurrentUserAuthorization()
    const data = await axios.get(url, {
      headers: {
        Authorization: authorization,
      },
      params: {
        ...(options != null ? options : {}),
      },
    })
    return data.data as T
  }

  async post<T>(
    url: string,
    body?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<T> {
    const authorization = await this.getCurrentUserAuthorization()

    return (
      await axios.post(url, body, {
        headers: {
          Authorization: authorization,
        },
        params: {
          ...(options != null ? options : {}),
        },
      })
    ).data as T
  }

  async put<T>(url: string, body?: Record<string, any>, options?: Record<string, any>): Promise<T> {
    const authorization = await this.getCurrentUserAuthorization()

    return (
      await axios.put(url, body, {
        headers: {
          Authorization: authorization,
        },
        params: {
          ...(options != null ? options : {}),
        },
      })
    ).data as T
  }

  async putFormData<T>(url: string, body?: FormData, options?: Record<string, any>): Promise<T> {
    const authorization = await this.getCurrentUserAuthorization()

    return (
      await axios.put(url, body, {
        headers: {
          Authorization: authorization,
          "Content-Type": "multipart/form-data",
        },
        params: {
          ...(options != null ? options : {}),
        },
      })
    ).data as T
  }

  async postFormData<T>(url: string, body?: FormData, options?: Record<string, any>): Promise<T> {
    const authorization = await this.getCurrentUserAuthorization()

    return (
      await axios.post(url, body, {
        headers: {
          Authorization: authorization,
          "Content-Type": "multipart/form-data",
        },
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
    const authorization = await this.getCurrentUserAuthorization()

    return (
      await axios.patch(url, body, {
        headers: {
          Authorization: authorization,
        },
        params: {
          ...(options != null ? options : {}),
        },
      })
    ).data as T
  }

  async delete<T>(
    url: string,
    body?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<T> {
    const authorization = await this.getCurrentUserAuthorization()
    return (
      await axios.delete(url, {
        headers: {
          Authorization: authorization,
        },
        data: body,
        params: {
          ...(options != null ? options : {}),
        },
      })
    ).data as T
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getCurrentUserAuthorization(): Promise<string> {
    // const currentUser = firebase.auth().currentUser
    const currentUser = "jin.bestvictoria718@gmail.com"
    if (currentUser) {
      // const token = await currentUser.getIdToken()
      const token = "123123123123"
      return `Bearer ${token}`.trim()
    } else {
      return ""
    }
  }
}
