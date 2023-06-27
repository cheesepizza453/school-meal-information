import { BrowserRouter, Routes, Route } from "react-router-dom";
import SchoolInfo from "./SchoolInfo";
import Header from "./Header";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<SchoolInfo />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
