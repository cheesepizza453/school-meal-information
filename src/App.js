import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import SchoolInfo from "./SchoolInfo";
import SchoolSearch from "./SearchSchool";
import Header from "./Header";
import "./index.css";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Header />
        <SchoolSearch />
        <SchoolInfo />
      </Provider>
    </div>
  );
}

export default App;
