import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovieDetail, getVideo, IGetMovieDetail, IGetVideo } from "../api";
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
  top: -80px;
  padding: 15px;
`;
const Meta = styled.div`
  display: flex;
`;
const IconVariants = {
  hover: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
};

function MovieDetail({ movieId }: { movieId: string }) {
  const [time, setTime] = useState(true);
  const [mute, setMute] = useState(true);
  const onRefreshClick = () => setTime(false);
  const onMuteClick = () => setMute((prev) => !prev);
  const onEnd = () => setTime(true);
  const { data, isLoading: detailLoading } = useQuery<IGetMovieDetail>(
    ["movie", movieId],
    () => getMovieDetail(movieId)
  );
  const { data: videoData, isLoading: videoIsLoading } = useQuery<IGetVideo>(
    ["video", movieId],
    () => getVideo(+movieId, "movie")
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
        <Loading />
      ) : (
        <Container>
          <Overlay />
          {time ? (
            <Home bgimg={makeImage(data?.backdrop_path || "")}>
              <Title draggable>{data?.title}</Title>
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
              <Title draggable>{data?.title}</Title>
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
            <Meta>
              <div>{data?.overview}</div>
              <div>장르 : {data?.genres.map((x) => x.name).join(", ")}</div>
            </Meta>
          </Detail>
        </Container>
      )}
    </>
  );
}

export default MovieDetail;
