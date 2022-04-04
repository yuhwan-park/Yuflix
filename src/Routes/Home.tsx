import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMovies } from "../api";
import HomeScreen from "../Components/HomeScreen";
import Nav from "../Components/Nav";

const Wrapper = styled.div`
  position: relative;
  height: 200vh;
`;
const Test = styled.div`
  position: absolute;
  top: 80vh;
`;
function Home() {
  const { data, isLoading } = useQuery<IGetMovies>(
    ["movie", "now_playing"],
    () => getMovies("now_playing")
  );
  return (
    <Wrapper>
      <Nav />
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <>
          <HomeScreen
            title={data?.results[0].title}
            backdrop_path={data?.results[0].backdrop_path}
          />
          <Test>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus iure
            corrupti veniam quasi repellat recusandae voluptas ut accusamus quo
            possimus? Sunt corporis fugiat placeat perspiciatis consequuntur
            commodi tempora deleniti dicta!
          </Test>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
