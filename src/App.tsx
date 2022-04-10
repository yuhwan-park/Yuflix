import { useViewportScroll } from "framer-motion";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { scrollYState } from "./atoms";
import Nav from "./Components/Nav";
import Home from "./Routes/Home";
import TvShow from "./Routes/TvShow";

function App() {
  const setScrollY = useSetRecoilState(scrollYState);
  const { scrollY } = useViewportScroll();
  useEffect(() => {
    scrollY.onChange((x) => {
      setScrollY(x);
    });
  }, [scrollY, setScrollY]);
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Nav />
      <Routes>
        <Route path="/tvshow" element={<TvShow />}>
          <Route path="/tvshow/tv/:tvId" element={<TvShow />} />
        </Route>
        <Route path="/" element={<Home />}>
          <Route path="/movie/:movieId" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

