import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovieDetail, IGetMovieDetail } from "../api";
import Loading from "./Loading";

const Container = styled.div`
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
`;

function MovieDetail({ movieId }: { movieId: string }) {
  const { data, isLoading } = useQuery<IGetMovieDetail>(
    ["movie", movieId],
    () => getMovieDetail(movieId)
  );
  return <>{isLoading ? <Loading /> : <Container></Container>}</>;
}

export default MovieDetail;
