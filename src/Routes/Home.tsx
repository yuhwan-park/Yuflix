import { useEffect } from "react";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { getMovies, IGetMovies } from "../api";
import { offsetState } from "../atoms";
import HomeScreen from "../Components/HomeScreen";
import Nav from "../Components/Nav";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  position: relative;
  height: 200vh;
  overflow-x: hidden;
`;

function Home() {
  const setOffset = useSetRecoilState(offsetState);
  const { data, isLoading } = useQuery<IGetMovies>(
    ["movie", "now_playing"],
    () => getMovies("now_playing")
  );

  window.onresize = function onResize() {
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
        <>
          <HomeScreen
            title={data?.results[0].title}
            backdrop_path={data?.results[0].backdrop_path}
          />
          <Slider {...(data as IGetMovies)} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
