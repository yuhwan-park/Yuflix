import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { IGetMovies } from "../api";
import { offsetState } from "../atoms";
import { genres, makeImage } from "../utils";

const Wrapper = styled(motion.div)`
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
const BoxWrapper = styled(motion.div)`
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const MovieInfo = styled(motion.div)`
  display: none;
  padding: 10px;
  width: 100%;
  background-color: #181818;
`;
const Title = styled.div`
  text-align: center;
  padding-bottom: 10px;
`;
const Release = styled.div`
  font-size: 10px;
`;
const Vote = styled.div`
  text-align: center;
  font-size: 10px;
`;
const Genres = styled.div`
  text-align: center;
  padding: 5px 0;
  font-size: 10px;
  span {
    &::after {
      content: " | ";
      color: #646464;
    }
    &:last-child {
      &::after {
        content: "";
      }
    }
  }
`;
const InfoWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 5px 0;
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
const movieBoxVariants = {
  init: {
    scale: 1,
  },
  hover: {
    boxShadow: "1px 3px 3px rgb(0 0 0 / 30%)",
    y: -100,
    scale: 1.5,
    transition: {
      delay: 0.5,
      type: "tween",
    },
  },
};
const movieInfoVariants = {
  hover: {
    display: "block",
    transition: {
      delay: 0.5,
      type: "tween",
    },
  },
};
function Slider({ results }: IGetMovies) {
  const [index, setIndex] = useState(0);
  const [back, setBack] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const offset = useRecoilValue(offsetState);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    setBack(false);
    const totalMovies = results.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };
  const decreaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    setBack(true);
    const totalMovies = results.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;
    setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };
  return (
    <Wrapper>
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
          {results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <BoxWrapper
                variants={movieBoxVariants}
                whileHover="hover"
                initial="init"
                key={movie.id}
                transition={{ type: "tween" }}
              >
                <MovieBox bgimg={makeImage(movie.poster_path)}></MovieBox>
                <MovieInfo variants={movieInfoVariants}>
                  <Title>{movie.title}</Title>
                  <InfoWrapper>
                    <Release>{movie.release_date}</Release>
                    <Vote>평점 : {movie.vote_average}</Vote>
                  </InfoWrapper>
                  <Genres>
                    {movie.genre_ids.map((x, i) => {
                      const genreArr: string[] = [];
                      Object.values(genres).forEach((y) => {
                        if (x === y.id) genreArr.push(y.name);
                      });
                      return <span key={i}>{genreArr}</span>;
                    })}
                  </Genres>
                </MovieInfo>
              </BoxWrapper>
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
    </Wrapper>
  );
}

export default Slider;
