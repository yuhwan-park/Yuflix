import { useViewportScroll } from "framer-motion";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { offsetState, scrollYState } from "./atoms";
import Nav from "./Components/Nav";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import TvShow from "./Routes/TvShow";

function App() {
  const setOffset = useSetRecoilState(offsetState);
  const setScrollY = useSetRecoilState(scrollYState);
  const { scrollY } = useViewportScroll();
  window.onresize = function () {
    if (window.innerWidth > 1200) {
      setOffset(6);
    }
    if (window.innerWidth <= 1200) {
      setOffset(5);
    }
    if (window.innerWidth <= 1000) {
      setOffset(4);
    }
    if (window.innerWidth <= 800) {
      setOffset(3);
    }
    if (window.innerWidth <= 600) {
      setOffset(2);
    }
  };
  useEffect(() => {
    if (window.innerWidth > 1200) {
      setOffset(6);
    }
    if (window.innerWidth <= 1200) {
      setOffset(5);
    }
    if (window.innerWidth <= 1000) {
      setOffset(4);
    }
    if (window.innerWidth <= 800) {
      setOffset(3);
    }
    if (window.innerWidth <= 600) {
      setOffset(2);
    }
  }, [setOffset]);
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
          <Route path="/tvshow/tv/:id" element={<TvShow />} />
        </Route>
        <Route path="/" element={<Home />}>
          <Route path="/movie/:id" element={<Home />} />
        </Route>
        <Route path="/search/:searchValue" element={<Search />}>
          <Route path="/search/:searchValue/tv/:id" element={<Search />} />
          <Route path="/search/:searchValue/movie/:id" element={<Search />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

