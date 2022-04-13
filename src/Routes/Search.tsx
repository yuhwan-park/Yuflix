import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { getSearch, IGetSearch, ISearchMovie, ISearchTvshow } from "../api";
import { scrollYState } from "../atoms";
import DetailModal from "../Components/DetailModal";
import Loading from "../Components/Loading";
import TvDetailModal from "../Components/TvDetailModal";
import { genres, makeImage } from "../utils";

const Wrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  top: 140px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  padding: 0 60px;
  @media only screen and (max-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
  }
  @media only screen and (max-width: 1000px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media only screen and (max-width: 800px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media only screen and (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const MovieBox = styled(motion.div)<{ bgimg: string }>`
  height: 300px;
  background-image: url(${(props) => props.bgimg});
  background-position: center center;
  background-size: cover;
`;
const BoxWrapper = styled(motion.div)`
  cursor: pointer;
`;
const MovieInfo = styled(motion.div)`
  opacity: 0;
  padding: 10px;
  width: 100%;
  background-color: #181818;
`;
const Title = styled.div`
  text-align: center;
  padding-bottom: 10px;
`;
const SearchTitle = styled.div`
  font-size: 48px;
  padding: 0 60px;
  padding-bottom: 60px;
  font-weight: bold;
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
  width: 50vw;
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
const Release = styled.div`
  font-size: 10px;
`;
const Vote = styled.div`
  text-align: center;
  font-size: 10px;
`;
const Genres = styled.div`
  text-align: center;
  padding: 5px 0;
  font-size: 10px;
  span {
    &::after {
      content: " | ";
      color: #646464;
    }
    &:last-child {
      &::after {
        content: "";
      }
    }
  }
`;
const InfoWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 5px 0;
`;
const movieBoxVariants = {
  init: {
    scale: 1,
  },
  hover: {
    boxShadow: "rgb(0 0 0 / 75%) 0px 3px 10px",
    y: -100,
    scale: 1.3,
    transition: {
      delay: 0.5,
      type: "tween",
    },
  },
};
const movieInfoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};
function Search() {
  const scroll = useRecoilValue(scrollYState);
  const params = useParams<{ searchValue: string; id: string }>();
  const movieIdMatch = useMatch("search/:searchValue/movie/:id");
  const navigate = useNavigate();
  const { data, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteQuery<IGetSearch>(
      [params.searchValue],
      ({ pageParam = 1 }) => getSearch(params.searchValue as string, pageParam),
      {
        getNextPageParam: (lastPage) => {
          const nextPage = lastPage.page + 1;
          // getNextPageParam의 리턴값이 hasNextPage로 넘어감
          // 다음페이지가 총 페이지보다 많거나 페이지 수가 20개를 넘으면 false를 리턴
          return nextPage > lastPage.total_pages || nextPage > 20
            ? false
            : nextPage;
        },
      }
    );
  const onMovieClick = (movie: ISearchMovie | ISearchTvshow) => {
    if ("title" in movie) {
      navigate(`/search/${params.searchValue}/movie/${movie.id}`);
    } else {
      navigate(`/search/${params.searchValue}/tv/${movie.id}`);
    }
  };
  const onOverlayClick = () => {
    navigate(-1);
  };
  useEffect(() => {
    // 다음페이지가 있으면 계속 불러오기 (total page까지)
    if (hasNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, data?.pages]);
  return (
    <>
      {isLoading ? (
        <Loading width="100vw" height="100vh" />
      ) : (
        <>
          <Wrapper>
            <SearchTitle>
              '{params.searchValue}' 검색 결과&nbsp;
              {document.querySelectorAll(".movieBox").length}건
            </SearchTitle>
            <Row>
              {data?.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.results.map((movie) =>
                    movie.popularity > 20 ? (
                      <BoxWrapper
                        layoutId={movie.id + ""}
                        onClick={() => onMovieClick(movie)}
                        variants={movieBoxVariants}
                        whileHover="hover"
                        initial="init"
                        key={movie.id}
                        transition={{ type: "tween" }}
                        className="movieBox"
                      >
                        <MovieBox
                          bgimg={makeImage(movie.poster_path)}
                        ></MovieBox>
                        <MovieInfo variants={movieInfoVariants}>
                          <Title>
                            {"title" in movie ? movie.title : movie.name}
                          </Title>
                          <InfoWrapper>
                            <Release>
                              {"release_date" in movie
                                ? movie.release_date
                                : movie.first_air_date}
                            </Release>
                            <Vote>평점 : {movie.vote_average || "없음"}</Vote>
                          </InfoWrapper>
                          <Genres>
                            {movie.genre_ids.map((id, i) => {
                              return Object.values(genres).map((genreList) =>
                                id === genreList.id ? (
                                  <span key={i}>{genreList.name}</span>
                                ) : null
                              );
                            })}
                          </Genres>
                        </MovieInfo>
                      </BoxWrapper>
                    ) : null
                  )}
                </React.Fragment>
              ))}
            </Row>
          </Wrapper>
          <AnimatePresence>
            {params.id ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <Modal
                  layoutId={params.id}
                  style={{ top: scroll + 70 }}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {movieIdMatch ? (
                    <DetailModal movieId={params.id} />
                  ) : (
                    <TvDetailModal tvId={params.id} />
                  )}
                </Modal>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </>
  );
}

export default Search;
