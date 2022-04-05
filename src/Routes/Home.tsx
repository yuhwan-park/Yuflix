import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMovies } from "../api";
import HomeScreen from "../Components/HomeScreen";
import Nav from "../Components/Nav";
import { makeImage } from "../utils";

const Wrapper = styled.div`
  position: relative;
  height: 200vh;
  overflow-x: hidden;
`;
const Slider = styled(motion.div)`
  position: relative;
  top: 80vh;
  width: 100%;
  &:hover {
    i {
      display: block;
    }
  }
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  @media only screen and (max-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
  }
  @media only screen and (max-width: 1000px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media only screen and (max-width: 800px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media only screen and (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const MovieBox = styled(motion.div)<{ bgimg: string }>`
  height: 360px;
  background-image: url(${(props) => props.bgimg});
  background-position: center center;
  background-size: cover;
`;
const Arrow = styled(motion.div)<{ arrow: "right" | "left" }>`
  height: 360px;
  width: 70px;
  position: absolute;
  ${(props) => props.arrow} : 0px;
  display: flex;
  align-items: center;
  background-color: transparent;
  cursor: pointer;
  i {
    display: none;
    font-size: 35px;
    color: white;
    padding-left: 10px;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;
const rowVariants = {
  hidden: (back: boolean) => ({
    x: back ? -window.innerWidth : window.innerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: (back: boolean) => ({
    x: back ? window.innerWidth : -window.innerWidth,
  }),
};
const arrowVariants = {
  init: {
    scale: 1,
  },
  hover: {
    scale: 1.5,
  },
};
function Home() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const [offset, setOffset] = useState(6);
  const { data, isLoading } = useQuery<IGetMovies>(
    ["movie", "now_playing"],
    () => getMovies("now_playing")
  );
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setBack(false);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setBack(true);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  window.onresize = function onResize() {
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
  }, []);
  return (
    <Wrapper>
      <Nav />
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <>
          <HomeScreen
            title={data?.results[0].title}
            backdrop_path={data?.results[0].backdrop_path}
          />
          <Slider>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
              custom={back}
            >
              <Row
                custom={back}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1.5 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <MovieBox
                      bgimg={makeImage(movie.poster_path)}
                      key={movie.id}
                    ></MovieBox>
                  ))}
              </Row>
            </AnimatePresence>
            <Arrow arrow="left" onClick={decreaseIndex}>
              <motion.i
                variants={arrowVariants}
                initial="init"
                whileHover="hover"
                className="fa-solid fa-chevron-left"
              ></motion.i>
            </Arrow>
            <Arrow arrow="right" onClick={increaseIndex}>
              <motion.i
                variants={arrowVariants}
                initial="init"
                whileHover="hover"
                className="fa-solid fa-chevron-right"
              ></motion.i>
            </Arrow>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
