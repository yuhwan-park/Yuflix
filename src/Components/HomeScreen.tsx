import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { searchState } from "../atoms";
import { makeImage, makeVideoUrl } from "../utils";
import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import { getVideo, IGetVideo } from "../api";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
const Container = styled.div`
  position: relative;
`;
const Home = styled(motion.div)<{ bgimg: string }>`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${(props) => props.bgimg});
  background-size: cover;
  background-position: center center;
  @media screen and (max-width: 400px) {
    height: 40vh;
  }
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
  @media screen and (max-width: 400px) {
    height: 40vh;
  }
`;
const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(20, 20, 20, 1));
  @media screen and (max-width: 400px) {
    height: 40vh;
  }
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 50%;
  padding-left: 77px;
  @media screen and (max-width: 400px) {
    padding-left: 30px;
  }
`;
const Title = styled.div`
  font-size: 68px;
  font-weight: 700;
  text-shadow: 1px 3px 10px rgb(0 0 0);
  @media screen and (max-width: 400px) {
    font-size: 20px;
  }
`;
const DetailBtn = styled.button`
  border: none;
  border-radius: 10px;
  margin-top: 36px;
  font-size: 20px;
  font-weight: 800;
  color: white;
  width: 10vw;
  height: 60px;
  cursor: pointer;
  background-color: rgba(205, 209, 204, 0.4);
  &:hover {
    background-color: rgba(205, 209, 204, 0.1);
  }
  @media screen and (max-width: 400px) {
    width: 100px;
    height: 40px;
    margin-top: 10px;
    font-size: 14px;
  }
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
  @media screen and (max-width: 400px) {
    top: 20vh;
    width: 40px;
    height: 40px;
    margin-right: 20px;
    i {
      font-size: 14px;
    }
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
  const setSearch = useSetRecoilState(searchState);
  const navigate = useNavigate();
  const match = useMatch("/");
  const tvMatch = useMatch("/tvshow");
  const { data, isLoading } = useQuery<IGetVideo>("video", () =>
    getVideo(id ? id : 0, format)
  );
  const searchClick = () => {
    setSearch(false);
  };
  const onEnd = () => setTime(true);
  const onMuteClick = () => setMute((prev) => !prev);
  const onRefreshClick = () => setTime(false);
  const onDetailBtnClick = () => {
    if (tvMatch) {
      navigate(`/tvshow/tv/${id}`);
    } else {
      navigate(`/movie/${id}`);
    }
  };
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
  useEffect(() => {
    // 다른 페이지로 이동시 player를 pause
    if (match || tvMatch) {
      setPause(true);
    } else {
      setPause(false);
    }
  }, [match, tvMatch]);
  return (
    <>
      {isLoading ? null : (
        <Container>
          <Overlay onClick={searchClick} />
          <AnimatePresence exitBeforeEnter>
            {time ? (
              <Home bgimg={makeImage(backdrop_path || "")}>
                <Wrapper>
                  <Title draggable>{title}</Title>
                  <DetailBtn onClick={onDetailBtnClick}>상세 정보</DetailBtn>
                </Wrapper>
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
                <Wrapper>
                  <Title draggable>{title}</Title>
                  <DetailBtn onClick={onDetailBtnClick}>상세 정보</DetailBtn>
                </Wrapper>
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
        </Container>
      )}
    </>
  );
}

export default HomeScreen;
