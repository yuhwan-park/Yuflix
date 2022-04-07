import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./Components/Nav";
import Home from "./Routes/Home";
import TvShow from "./Routes/TvShow";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/tvshow" element={<TvShow />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

