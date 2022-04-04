import { useQuery } from "react-query";
import styled from "styled-components";
import { getTvshows, IGetTvShows } from "../api";
import HomeScreen from "../Components/HomeScreen";
import Nav from "../Components/Nav";

const Wrapper = styled.div`
  position: relative;
  height: 200vh;
`;
function TvShow() {
  const { data, isLoading } = useQuery<IGetTvShows>(
    ["tvshow", "on_the_air"],
    () => getTvshows("on_the_air")
  );
  return (
    <Wrapper>
      <Nav />
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <>
          <HomeScreen
            title={data?.results[0].name}
            backdrop_path={data?.results[0].backdrop_path}
          />
        </>
      )}
    </Wrapper>
  );
}

export default TvShow;
