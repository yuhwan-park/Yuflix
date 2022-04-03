import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import TvShow from "./Routes/TvShow";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tvshow" element={<TvShow />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

