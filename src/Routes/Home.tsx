import { AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getMovies,
  getMovieWithGenre,
  IGetDatelessMovies,
  IGetMovies,
} from "../api";
import HomeScreen from "../Components/HomeScreen";
import Loading from "../Components/Loading";
import Modal from "../Components/Modal";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  min-height: 1000px;
  overflow: hidden;
`;
function Home() {
  const movieMatch = useMatch("movie/:id");
  const { data: nowPlayingData, isLoading: nowPlayingIsLoading } =
    useQuery<IGetMovies>(["movie", "now_playing"], () =>
      getMovies("now_playing", 1)
    );
  const { data: popularData, isLoading: popularLoading } =
    useQuery<IGetDatelessMovies>(["movie", "popular"], () =>
      getMovies("popular", 4)
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
  const isLoading =
    nowPlayingIsLoading ||
    popularLoading ||
    upcomingLoading ||
    topRatedLoading ||
    sfLoading ||
    animeLoading;
  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loading width="100vw" height="100vh" />
        ) : (
          <main>
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
          </main>
        )}
      </Wrapper>
      {/* Movie Modal Section */}
      <AnimatePresence>
        {movieMatch?.params.id ? <Modal /> : null}
      </AnimatePresence>
    </>
  );
}

export default Home;
