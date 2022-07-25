import React from "react"
import { Provider, observer } from "mobx-react"
import { store } from "./store"
import { BrowserRouter as Router } from "react-router-dom"
import BaseRouter from "./BaseRouter"

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <BaseRouter />
        </Router>
      </div>
    </Provider>
  )
}

export default observer(App)
