import { autorun, configure, makeAutoObservable } from "mobx"

configure({ enforceActions: "always" })

export class MainStore {
  app_title = "Hello World"
  login_status = true

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
        MainStore.name,
        JSON.stringify({
          app_title: this.app_title,
          login_status: this.login_status,
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
      Object.assign(this, JSON.parse(window.localStorage.getItem(MainStore.name) || "{}"))
    } else {
      Object.assign(this, {})
    }
  }

  setAppTitle = (app_title: string) => {
    this.app_title = app_title
    this.save()
  }

  setLoginStatus = (login_status: boolean) => {
    this.login_status = login_status
    this.save()
  }

  init = () => {
    this.app_title = ""
    this.login_status = false
    this.save()
  }
}

export default new MainStore()
