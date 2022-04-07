import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { searchState } from "../atoms";
import { makeImage, makeVideoUrl } from "../utils";
import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import { getVideo, IGetVideo } from "../api";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
const Home = styled(motion.div)<{ bgimg: string }>`
  left: -17px;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${(props) => props.bgimg});
  background-size: cover;
  background-position: center center;
`;
const PlayContainer = styled(motion.div)`
  min-width: 100%;
  height: 100vh;
  background-color: rgba(20, 20, 20, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: -1;
`;
const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(20, 20, 20, 1));
`;
const Title = styled.div`
  position: absolute;
  left: 0;
  padding-left: 77px;
  font-size: 68px;
  font-weight: 700;
  text-shadow: 1px 3px 10px rgb(0 0 0);
`;
const IconWrapper = styled(motion.div)`
  position: absolute;
  right: 0;
  top: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: 77px;
  border: 1px solid white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  i {
    color: white;
    font-size: 24px;
  }
`;
const IconVariants = {
  hover: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
};
interface IHomeScreenProps {
  title: string | undefined;
  backdrop_path: string | undefined;
  id: number | undefined;
  format: string;
}
function HomeScreen({ title, backdrop_path, id, format }: IHomeScreenProps) {
  const [pause, setPause] = useState(true);
  const [mute, setMute] = useState(true);
  const [time, setTime] = useState(true);
  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<IGetVideo>("video", () =>
    getVideo(id ? id : 0, format)
  );
  const setSearch = useSetRecoilState(searchState);
  const searchClick = () => {
    setSearch(false);
  };
  const onEnd = () => setTime(true);
  const onMuteClick = () => setMute((prev) => !prev);
  const onRefreshClick = () => setTime(false);
  useEffect(() => {
    setTimeout(() => {
      setTime(false);
    }, 5000);
  }, []);
  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > window.innerHeight * 0.5) {
        setPause(false);
      }
      if (scrollY.get() < window.innerHeight * 0.5) {
        setPause(true);
      }
    });
  }, [scrollY]);
  return (
    <>
      {isLoading ? null : (
        <>
          <Overlay onClick={searchClick} />
          <AnimatePresence exitBeforeEnter>
            {time ? (
              <Home bgimg={makeImage(backdrop_path || "")}>
                <Title draggable>{title}</Title>
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
                <Title draggable>{title}</Title>
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
                  url={makeVideoUrl(data ? data?.results[0].key : "")}
                  width="100vw"
                  height="115vh"
                  playing={pause ? true : false}
                  volume={0.2}
                  muted={mute ? true : false}
                  controls={false}
                  onEnded={onEnd}
                ></ReactPlayer>
              </PlayContainer>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}

export default HomeScreen;
