import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  getMovies,
  getMovieWithGenre,
  IGetDatelessMovies,
  IGetMovies,
} from "../api";
import { offsetState, scrollYState } from "../atoms";
import HomeScreen from "../Components/HomeScreen";
import Loading from "../Components/Loading";
import MovieDetail from "../Components/MovieDetail";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  min-height: 1000px;
  overflow: hidden;
`;
const Main = styled.main``;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const Modal = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: 90vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: rgba(20, 20, 20, 1);
  box-shadow: rgb(0 0 0 / 75%) 0px 3px 10px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 10px;
    border-radius: 6px;
    background: #908e8e;
  }
  &::-webkit-scrollbar-thumb {
    height: 8px;
    background: #393737;
    border-radius: 6px;
  }
  @media (max-width: 800px) {
    width: 100vw;
  }
`;
function Home() {
  const setOffset = useSetRecoilState(offsetState);
  const navigate = useNavigate(); // URL을 바꾸기 위한 hook
  const [scroll, setScrollY] = useRecoilState(scrollYState);
  const { scrollY } = useViewportScroll();
  const movieMatch = useMatch("movie/:movieId");
  const { data: nowPlayingData, isLoading: nowPlayingIsLoading } =
    useQuery<IGetMovies>(["movie", "now_playing"], () =>
      getMovies("now_playing", 1)
    );
  const { data: popularData, isLoading: popularLoading } =
    useQuery<IGetDatelessMovies>(["movie", "popular"], () =>
      getMovies("popular", 3)
    );
  const { data: upcomingData, isLoading: upcomingLoading } =
    useQuery<IGetMovies>(["movie", "upcoming"], () => getMovies("upcoming", 1));
  const { data: topRatedData, isLoading: topRatedLoading } =
    useQuery<IGetDatelessMovies>(["movie", "top_rated"], () =>
      getMovies("top_rated", 1)
    );
  const { data: sfData, isLoading: sfLoading } = useQuery<IGetDatelessMovies>(
    ["movie", "sf"],
    () => getMovieWithGenre(878, 2)
  );
  const { data: animeData, isLoading: animeLoading } =
    useQuery<IGetDatelessMovies>(["movie", "anime"], () =>
      getMovieWithGenre(16, 1)
    );
  const onOverlayClick = () => {
    navigate("/");
  };
  const isLoading =
    nowPlayingIsLoading ||
    popularLoading ||
    upcomingLoading ||
    topRatedLoading ||
    sfLoading ||
    animeLoading;
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
    <>
      <Wrapper>
        {isLoading ? (
          <Loading />
        ) : (
          <Main>
            <HomeScreen
              title={nowPlayingData?.results[0].title}
              backdrop_path={nowPlayingData?.results[0].backdrop_path}
              id={nowPlayingData?.results[0].id}
              format={"movie"}
            />
            <Slider
              {...(nowPlayingData as IGetMovies)}
              title="현재 상영중인 영화"
            />
            <Slider
              {...(popularData as IGetDatelessMovies)}
              title="인기 있는 영화"
            />
            <Slider {...(upcomingData as IGetMovies)} title="개봉 예정 영화" />
            <Slider
              {...(topRatedData as IGetDatelessMovies)}
              title="TOP20 영화"
            />
            <Slider {...(sfData as IGetDatelessMovies)} title="SF 영화" />
            <Slider {...(animeData as IGetDatelessMovies)} title="애니메이션" />
          </Main>
        )}
      </Wrapper>
      {/* Movie Modal Section */}
      <AnimatePresence>
        {movieMatch?.params.movieId ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <Modal
              style={{ top: scroll + 70 }}
              layoutId={movieMatch.params.movieId}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MovieDetail {...(movieMatch.params as { movieId: string })} />
            </Modal>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Home;
