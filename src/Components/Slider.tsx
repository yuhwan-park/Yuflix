import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import {
  IGetDatelessMovies,
  IGetMovies,
  IGetTvShows,
  IMovie,
  ITvShow,
} from "../api";
import { offsetState } from "../atoms";
import { genres, makeImage } from "../utils";

const Wrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  top: -150px;
  height: 450px;
  margin-bottom: 50px;
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
  padding: 0 60px;
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
const Arrow = styled(motion.div)`
  height: 360px;
  width: 70px;
  position: absolute;
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
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const SliderTitle = styled.h1`
  padding: 30px 0px;
  padding-left: 60px;
  font-size: 40px;
  font-weight: 700;
  text-shadow: 1px 3px 10px rgb(0 0 0);
`;
const MovieInfo = styled(motion.div)`
  opacity: 0;
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
    boxShadow: "rgb(0 0 0 / 75%) 0px 3px 10px",
    y: -150,
    scale: 1.5,
    transition: {
      delay: 0.5,
      type: "tween",
    },
  },
};
const movieInfoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};
interface ISliderProps {
  results:
    | IGetMovies["results"]
    | IGetDatelessMovies["results"]
    | IGetTvShows["results"];
  title: string;
}
function Slider({ results, title }: ISliderProps) {
  const navigate = useNavigate();
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
  const onMovieClick = (movie: IMovie | ITvShow) => {
    if ("title" in movie) {
      navigate(`movie/${movie.id}`);
    } else if ("name" in movie) {
      navigate(`/tvshow/tv/${movie.id}`);
    }
  };
  return (
    <Wrapper>
      <SliderTitle>{title}</SliderTitle>
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
                layoutId={movie.id + ""}
                onClick={() => onMovieClick(movie)}
                variants={movieBoxVariants}
                whileHover="hover"
                initial="init"
                key={movie.id}
                transition={{ type: "tween" }}
              >
                <MovieBox bgimg={makeImage(movie.poster_path)}></MovieBox>
                <MovieInfo variants={movieInfoVariants}>
                  <Title>{"title" in movie ? movie.title : movie.name}</Title>
                  <InfoWrapper>
                    <Release>
                      {"release_date" in movie
                        ? movie.release_date
                        : movie.first_air_date}
                    </Release>
                    <Vote>평점 : {movie.vote_average}</Vote>
                  </InfoWrapper>
                  <Genres>
                    {movie.genre_ids.map((id, i) => {
                      return Object.values(genres).map((genreList) =>
                        id === genreList.id ? (
                          <span key={i}>{genreList.name}</span>
                        ) : null
                      );
                    })}
                  </Genres>
                </MovieInfo>
              </BoxWrapper>
            ))}
        </Row>
      </AnimatePresence>
      <Arrow onClick={decreaseIndex} style={{ left: 0 }}>
        <motion.i
          variants={arrowVariants}
          initial="init"
          whileHover="hover"
          className="fa-solid fa-chevron-left"
        ></motion.i>
      </Arrow>
      <Arrow onClick={increaseIndex} style={{ right: -25 }}>
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
