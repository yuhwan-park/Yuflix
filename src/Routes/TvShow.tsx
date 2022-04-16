import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { getTvshows, IGetTvShows } from "../api";
import { scrollYState } from "../atoms";
import HomeScreen from "../Components/HomeScreen";
import Loading from "../Components/Loading";
import Slider from "../Components/Slider";
import TvDetailModal from "../Components/TvDetailModal";

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
function TvShow() {
  const navigate = useNavigate(); // URL을 바꾸기 위한 hook
  const scroll = useRecoilValue(scrollYState);
  const tvMatch = useMatch("/tvshow/tv/:id");
  const onOverlayClick = () => {
    navigate("/tvshow");
  };
  const { data: koreaData, isLoading: koreaIsLoading } = useQuery<IGetTvShows>(
    ["tvshow", "koreanTv"],
    () =>
      getTvshows(
        "&sort_by=popularity.desc&page=1&include_null_first_air_dates=false&with_original_language=ko"
      )
  );
  const { data: popularData, isLoading: popularIsLoading } =
    useQuery<IGetTvShows>(["tvshow", "popular"], () =>
      getTvshows(
        "&sort_by=popularity.desc&page=1&include_null_first_air_dates=false"
      )
    );
  const { data: animeData, isLoading: animeIsLoading } = useQuery<IGetTvShows>(
    ["tvshow", "anime"],
    () => getTvshows("&sort_by=popularity.desc&page=1&with_genres=16")
  );
  const { data: crimeData, isLoading: crimeIsLoading } = useQuery<IGetTvShows>(
    ["tvshow", "crime"],
    () => getTvshows("&sort_by=popularity.desc&page=3&with_genres=80")
  );
  const { data: comedyData, isLoading: comedyIsLoading } =
    useQuery<IGetTvShows>(["tvshow", "comedy"], () =>
      getTvshows(
        "&sort_by=popularity.desc&page=2&with_genres=35&with_original_language=en%7Cko"
      )
    );
  const isLoading =
    koreaIsLoading ||
    popularIsLoading ||
    animeIsLoading ||
    crimeIsLoading ||
    comedyIsLoading;
  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loading width="100vw" height="100vh" />
        ) : (
          <main>
            <HomeScreen
              title={popularData?.results[0].name}
              backdrop_path={popularData?.results[0].backdrop_path}
              id={popularData?.results[0].id}
              format="tv"
            />
            <Slider
              {...(koreaData as IGetTvShows)}
              title="인기있는 한국 드라마"
            />
            <Slider {...(popularData as IGetTvShows)} title="인기 드라마" />
            <Slider {...(animeData as IGetTvShows)} title="애니메이션 시리즈" />
            <Slider
              {...(crimeData as IGetTvShows)}
              title="범죄에 관련된 시리즈"
            />
            <Slider {...(comedyData as IGetTvShows)} title="코미디 시리즈" />
          </main>
        )}
      </Wrapper>
      {/* TVshow Modal Section */}
      <AnimatePresence>
        {tvMatch?.params.id ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <Modal
              style={{ top: scroll + 70 }}
              layoutId={tvMatch.params.id}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <TvDetailModal {...(tvMatch.params as { id: string })} />
            </Modal>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default TvShow;
