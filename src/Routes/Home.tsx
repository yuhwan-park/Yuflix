import { useEffect } from "react";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  getMovies,
  getMovieWithGenre,
  IGetDatelessMovies,
  IGetMovies,
} from "../api";
import { offsetState } from "../atoms";
import HomeScreen from "../Components/HomeScreen";
import Nav from "../Components/Nav";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  position: relative;
  min-height: 1000px;
  overflow: hidden;
`;
const Main = styled.main``;

function Home() {
  const setOffset = useSetRecoilState(offsetState);
  const { data: nowPlayingData, isLoading: nowPlayingIsLoading } =
    useQuery<IGetMovies>(["movie", "now_playing"], () =>
      getMovies("now_playing", 1)
    );
  const { data: popularData, isLoading: popularLoading } =
    useQuery<IGetDatelessMovies>(["movie", "popular"], () =>
      getMovies("popular", 2)
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
  return (
    <Wrapper>
      <Nav />
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <Main>
          <HomeScreen
            title={nowPlayingData?.results[0].title}
            backdrop_path={nowPlayingData?.results[0].backdrop_path}
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
  );
}

export default Home;
