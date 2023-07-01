import { BrowserRouter, Routes, Route } from "react-router-dom";
import SchoolInfo from "./SchoolInfo";
import Main from "./Main";
import "./index.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Main />
        <Routes>
          <Route path="/" element={<SchoolInfo />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
