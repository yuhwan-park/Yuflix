import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
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
const Slider = styled.div`
  position: relative;
  top: 80vh;
  width: 100%;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const MovieBox = styled(motion.div)<{ bgimg: string }>`
  height: 400px;
  background-image: url(${(props) => props.bgimg});
  background-position: center center;
  background-size: cover;
`;
const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};
function Home() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const { data, isLoading } = useQuery<IGetMovies>(
    ["movie", "now_playing"],
    () => getMovies("now_playing")
  );
  const offset = 6;
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  return (
    <Wrapper onClick={incraseIndex}>
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
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
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
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
