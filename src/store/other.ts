import { autorun, configure, makeAutoObservable } from "mobx"
import { ToastParams } from "../models/toast"

configure({ enforceActions: "always" })

export class OtherStore {
  toastParams = {} as ToastParams
  loading = false

  constructor() {
    this.load()
    autorun(this.save)
    makeAutoObservable(this)
  }

  private save = () => {
    if (
      typeof window !== "undefined" &&
      window.localStorage !== null &&
      typeof window.localStorage !== "undefined"
    ) {
      window.localStorage.setItem(
        OtherStore.name,
        JSON.stringify({
          toastParams: this.toastParams,
          loading: this.loading
        })
      )
    }
  }

  private load = () => {
    if (
      typeof window !== "undefined" &&
      window.localStorage !== null &&
      typeof window.localStorage !== "undefined"
    ) {
      Object.assign(this, JSON.parse(window.localStorage.getItem(OtherStore.name) || "{}"))
    } else {
      Object.assign(this, {})
    }
  }

  setToastParams = (toastParams: ToastParams) => {
    this.toastParams = toastParams
    this.save()
  }

  resetStatuses = () => {
    this.setToastParams({
      msg: "",
      isError: false,
      isWarning: false,
      isInfo: false,
      isSuccess: false,
    })
    this.save()
  }

  setLoading = (loading: boolean) => {
    this.loading = loading
    this.save()
  }

  init = () => {
    this.toastParams = {} as ToastParams
    this.loading = false
    this.save()
  }
}

export default new OtherStore()
