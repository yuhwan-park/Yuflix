import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./Components/Nav";
import Home from "./Routes/Home";
import TvShow from "./Routes/TvShow";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Nav />
      <Routes>
        <Route path="/tvshow" element={<TvShow />} />
        <Route path="/" element={<Home />}>
          <Route path="/movie/:movieId" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

