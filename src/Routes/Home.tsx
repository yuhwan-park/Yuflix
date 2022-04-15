import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import {
  getMovies,
  getMovieWithGenre,
  IGetDatelessMovies,
  IGetMovies,
} from "../api";
import { scrollYState } from "../atoms";
import HomeScreen from "../Components/HomeScreen";
import Loading from "../Components/Loading";
import DetailModal from "../Components/DetailModal";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  min-height: 1000px;
  overflow: hidden;
`;
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
  width: 60vw;
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
  const navigate = useNavigate(); // URL을 바꾸기 위한 hook
  const scroll = useRecoilValue(scrollYState);
  const movieMatch = useMatch("movie/:id");
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
        {movieMatch?.params.id ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <Modal
              style={{ top: scroll + 70 }}
              layoutId={movieMatch.params.id}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <DetailModal {...(movieMatch.params as { id: string })} />
            </Modal>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Home;
