import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getTvDetail,
  getTvEpisode,
  getVideo,
  IGetTvDetail,
  IGetTvEpisode,
  IGetVideo,
} from "../api";
import { makeEpImage, makeImage, makeVideoUrl } from "../utils";
import Loading from "./Loading";

const Container = styled.div`
  position: relative;
`;
const Home = styled(motion.div)<{ bgimg: string }>`
  width: 100%;
  height: 50vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${(props) => props.bgimg});
  background-size: cover;
  background-position: center center;
`;
const Title = styled.div`
  position: absolute;
  left: 0;
  top: 300px;
  padding-left: 20px;
  font-size: 24px;
  font-weight: 700;
  text-shadow: 1px 3px 10px rgb(0 0 0);
`;
const IconWrapper = styled(motion.div)`
  position: absolute;
  right: 0;
  top: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: 55px;
  border: 1px solid white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  i {
    color: white;
    font-size: 16px;
  }
`;
const PlayContainer = styled(motion.div)`
  min-width: 100%;
  min-height: 500px;
  height: 50vh;
  background-color: rgba(20, 20, 20, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: -1;
`;
const Overlay = styled.div`
  width: 100%;
  height: 50vh;
  min-height: 500px;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0),
    rgba(20, 20, 20, 1)
  );
`;
const Detail = styled.div`
  position: relative;
  padding: 30px;
`;
const Info = styled.div`
  display: flex;
  align-items: center;
`;
const Overview = styled.div<{ more: boolean }>`
  width: 50%;
  font-size: 18px;
  div {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: ${(props) => (props.more ? 4 : Infinity)};
    -webkit-box-orient: vertical;
    line-height: 25px;
  }
  span {
    display: inline-block;
    padding: 6px 0;
    font-size: 16px;
    font-style: italic;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;
const Meta = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 50%;
  span {
    padding: 10px 0;
    p {
      display: inline;
      color: darkgray;
    }
  }
`;
const DateAndTime = styled.div`
  font-size: 14px;
  padding: 20px 0px;
  span {
    padding-right: 10px;
  }
`;
const EpTitle = styled.h2`
  padding: 30px 0 0 50px;
  font-size: 24px;
  font-weight: bold;
`;
const EpContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 30px 30px 30px;
`;
const EpWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 30px;
  border-bottom: 1px solid #404040;
  cursor: pointer;
  .epNum {
    width: 50px;
    font-size: 30px;
    color: #d2d2d2;
  }
  &:hover {
    i {
      opacity: 1;
    }
  }
`;
const EpImg = styled.div<{ epimg: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100px;
  background-image: url(${(props) => props.epimg});
  background-size: cover;
  background-position: center center;
  border-radius: 6px;
  overflow: hidden;
  i {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    border: 1px solid white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.3);
    transition: opacity 0.2s linear;
  }
`;
const EpOverview = styled.div`
  color: #d2d2d2;
  font-size: 14px;
  width: 80%;
  padding: 10px;
  padding-left: 20px;
  line-height: 18px;
  div {
    font-size: 18px;
    padding-bottom: 10px;
    color: white;
    font-weight: 700;
  }
`;
const PageButton = styled.div`
  height: 0;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid #404040;
  i {
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0;
    width: 48px;
    height: 48px;
    font-size: 20px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      border: 2px solid white;
    }
    &:active {
      background-color: rgba(255, 255, 255, 0.4);
    }
  }
`;
const IconVariants = {
  hover: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
};

function TvDetail({ id }: { id: string }) {
  const [time, setTime] = useState(true);
  const [mute, setMute] = useState(true);
  const [more, setMore] = useState(true);
  const [page, setPage] = useState(true);
  const onRefreshClick = () => setTime(false);
  const onMuteClick = () => setMute((prev) => !prev);
  const onEnd = () => setTime(true);
  const onOverviewClick = () => {
    setMore((prev) => !prev);
  };
  const { data, isLoading: detailLoading } = useQuery<IGetTvDetail>(
    ["tv", id],
    () => getTvDetail(id)
  );
  const { data: videoData, isLoading: videoIsLoading } = useQuery<IGetVideo>(
    ["video", id],
    () => getVideo(+id, "tv")
  );
  const { data: episodeData, isLoading: episodeIsLoading } =
    useQuery<IGetTvEpisode>(["episode", id], () => getTvEpisode(id));
  const isLoading = detailLoading || videoIsLoading || episodeIsLoading;
  const onMoreClick = () => setPage((prev) => !prev);
  useEffect(() => {
    let mounted = true;
    // 메모리 누수 방지를 위해 컴포넌트가 사라졌을 때
    // state를 업데이트 하지 않도록 하는 기능
    setTimeout(() => {
      if (mounted) {
        setTime(false);
      }
    }, 5000);
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <>
      {isLoading ? (
        <Loading width="100%" height="100%" />
      ) : (
        <Container>
          <Overlay />
          {videoData?.results.length === 0 || time ? (
            <Home
              bgimg={makeImage(data?.backdrop_path || data?.poster_path || "")}
            >
              <Title draggable>{data?.name}</Title>
              <IconWrapper
                onClick={onRefreshClick}
                whileHover="hover"
                variants={IconVariants}
              >
                <i className="fa-solid fa-rotate-right"></i>
              </IconWrapper>
            </Home>
          ) : (
            <PlayContainer>
              <Title draggable>{data?.name}</Title>
              {mute ? (
                <IconWrapper
                  onClick={onMuteClick}
                  whileHover="hover"
                  variants={IconVariants}
                >
                  <i className="fa-solid fa-volume-xmark"></i>
                </IconWrapper>
              ) : (
                <IconWrapper
                  onClick={onMuteClick}
                  variants={IconVariants}
                  whileHover="hover"
                >
                  <i className="fa-solid fa-volume-high"></i>
                </IconWrapper>
              )}
              <ReactPlayer
                url={makeVideoUrl(videoData ? videoData.results[0].key : "")}
                width="100vw"
                height="115vh"
                playing
                volume={0.2}
                muted={mute ? true : false}
                controls={false}
                onEnded={onEnd}
              ></ReactPlayer>
            </PlayContainer>
          )}
          <Detail>
            <DateAndTime>
              <span>{data?.first_air_date.slice(0, 4)}</span>
              <span>시즌 {data?.number_of_seasons}개</span>
            </DateAndTime>
            <Info>
              <Overview more={more}>
                <div>{data?.overview}</div>
                <span onClick={onOverviewClick}>
                  {more ? "더 보기" : "접기"}
                </span>
              </Overview>
              <Meta>
                <span>
                  <p>장르 : </p>
                  {data?.genres.map((x) => x.name).join(", ")}
                </span>
                <span>
                  <p>평점 : </p>
                  {data?.vote_average || "없음"}
                </span>
              </Meta>
            </Info>
          </Detail>
          <EpTitle>회차</EpTitle>
          <EpContainer>
            {episodeData?.episodes.slice(0, page ? 10 : Infinity).map((ep) =>
              ep.overview ? (
                <EpWrapper key={ep.id}>
                  <div className="epNum">{ep.episode_number}</div>
                  <EpImg epimg={makeEpImage(ep.still_path)}>
                    <i className="fa-solid fa-play"></i>
                  </EpImg>
                  <EpOverview>
                    <div>{ep.episode_number}화</div>
                    {ep.overview}
                  </EpOverview>
                </EpWrapper>
              ) : null
            )}
            {episodeData && episodeData?.episodes.length > 10 ? (
              <PageButton>
                <i
                  onClick={onMoreClick}
                  className={`fa-solid fa-angle-${page ? "down" : "up"}`}
                ></i>
              </PageButton>
            ) : null}
          </EpContainer>
        </Container>
      )}
    </>
  );
}

export default TvDetail;
