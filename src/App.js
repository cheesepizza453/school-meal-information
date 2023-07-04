import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import SchoolInfo from "./SchoolInfo";
import SchoolSearch from "./SearchSchool";
import Main from "./Main";
import "./index.css";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Main />
        <SchoolSearch />
        <SchoolInfo />
      </Provider>
    </div>
  );
  document.getElementById("root");
}

export default App;
