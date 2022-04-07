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
  const { data, isLoading } = useQuery<IGetTvShows>(
    ["tvshow", "koreanTv"],
    () =>
      getTvshows(
        "&sort_by=popularity.desc&page=1&include_null_first_air_dates=false&with_original_language=ko"
      )
  );
  return (
    <Wrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <HomeScreen
            title={data?.results[0].name}
            backdrop_path={data?.results[0].backdrop_path}
            id={data?.results[0].id}
            format="tv"
          />
          <Slider {...(data as IGetTvShows)} title="인기있는 한국 시리즈" />
        </>
      )}
    </Wrapper>
  );
}

export default TvShow;
