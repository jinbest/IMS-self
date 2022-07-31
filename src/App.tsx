import React from "react"
import { Provider, observer } from "mobx-react"
import { store, otherStore } from "./store"
import { BrowserRouter as Router } from "react-router-dom"
import BaseRouter from "./BaseRouter"
import Header from "./components/Header"
import Toast from "./components/toast/toast"
import Loader from "./components/Loader"

function App() {
  const { toastParams, resetStatuses, loading } = otherStore

  return (
    <Provider store={store} otherStore={otherStore}>
      <div className="App">
        <Router>
          <Header />
          <BaseRouter />
        </Router>
      </div>

      <Toast params={toastParams} resetStatuses={resetStatuses} />
      {loading ? <Loader /> : null}
    </Provider>
  )
}

export default observer(App)
