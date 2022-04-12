import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getTvDetail, getVideo, IGetTvDetail, IGetVideo } from "../api";
import { makeImage, makeVideoUrl } from "../utils";
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
const IconVariants = {
  hover: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
};

function TvDetailModal({ tvId }: { tvId: string }) {
  const [time, setTime] = useState(true);
  const [mute, setMute] = useState(true);
  const [more, setMore] = useState(true);
  const onRefreshClick = () => setTime(false);
  const onMuteClick = () => setMute((prev) => !prev);
  const onEnd = () => setTime(true);
  const onOverviewClick = () => {
    setMore((prev) => !prev);
  };
  const { data, isLoading: detailLoading } = useQuery<IGetTvDetail>(
    ["tv", tvId],
    () => getTvDetail(tvId)
  );
  const { data: videoData, isLoading: videoIsLoading } = useQuery<IGetVideo>(
    ["video", tvId],
    () => getVideo(+tvId, "tv")
  );
  const isLoading = detailLoading || videoIsLoading;
  useEffect(() => {
    setTimeout(() => {
      setTime(false);
    }, 5000);
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
        </Container>
      )}
    </>
  );
}

export default TvDetailModal;
