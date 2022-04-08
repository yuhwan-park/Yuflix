import { useQuery } from "react-query";
import styled from "styled-components";
import { getTvshows, IGetTvShows } from "../api";
import HomeScreen from "../Components/HomeScreen";
import Loading from "../Components/Loading";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  position: relative;
  min-height: 1000px;
  overflow: hidden;
`;
function TvShow() {
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
    () => getTvshows("&sort_by=popularity.desc&page=1&with_genres=80")
  );
  const { data: comedyData, isLoading: comedyIsLoading } =
    useQuery<IGetTvShows>(["tvshow", "comedy"], () =>
      getTvshows(
        "&sort_by=popularity.desc&page=1&with_genres=35&with_original_language=en%7Cko"
      )
    );
  const isLoading =
    koreaIsLoading ||
    popularIsLoading ||
    animeIsLoading ||
    crimeIsLoading ||
    comedyIsLoading;
  return (
    <Wrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <>
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
        </>
      )}
    </Wrapper>
  );
}

export default TvShow;
