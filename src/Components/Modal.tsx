import { AnimatePresence, motion } from "framer-motion";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { scrollYState } from "../atoms";
import MovieDetail from "./MovieDetail";
import TvDetail from "./TvDetail";
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const Container = styled(motion.div)`
  position: absolute;
  width: 60vw;
  height: 90vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: rgba(20, 20, 20, 1);
  box-shadow: rgb(0 0 0 / 75%) 0px 3px 10px;
  overflow-y: scroll;
  opacity: 0;
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
const DetailWrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
`;
const modalVariants = {
  initial: {
    scale: 0.7,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
  },
  exit: {
    scale: 0.7,
    opacity: 0,
  },
};
const movieVariants = {
  initial: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};
function Modal() {
  const movieMatch = useMatch("movie/:id");
  const tvMatch = useMatch("/tvshow/tv/:id");
  const movieIdMatch = useMatch("search/:searchValue/movie/:id");
  const tvIdMatch = useMatch("search/:searchValue/tv/:id");
  const params = useParams<{ searchValue: string; id: string }>();
  const scroll = useRecoilValue(scrollYState);
  const navigate = useNavigate(); // URL을 바꾸기 위한 hook
  const onOverlayClick = () => {
    if (movieMatch) {
      navigate("/");
    } else if (tvMatch) {
      navigate("/tvshow");
    } else if (movieIdMatch || tvIdMatch) {
      navigate(`/search/${params.searchValue}`);
    }
  };
  return (
    <>
      <Overlay
        onClick={onOverlayClick}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <Container
        style={{ top: scroll + 70 }}
        variants={modalVariants}
        initial="initial"
        animate="show"
        exit="exit"
        transition={{ type: "tween" }}
      >
        <AnimatePresence>
          {movieMatch?.params.id ? (
            <DetailWrapper
              variants={movieVariants}
              initial="initial"
              animate="show"
              exit="exit"
              transition={{ type: "tween" }}
            >
              <MovieDetail {...(movieMatch?.params as { id: string })} />
            </DetailWrapper>
          ) : tvMatch?.params.id ? (
            <DetailWrapper
              variants={movieVariants}
              initial="initial"
              animate="show"
              exit="exit"
              transition={{ type: "tween" }}
            >
              <TvDetail {...(tvMatch.params as { id: string })} />
            </DetailWrapper>
          ) : movieIdMatch?.params.id ? (
            <DetailWrapper
              variants={movieVariants}
              initial="initial"
              animate="show"
              exit="exit"
              transition={{ type: "tween" }}
            >
              <MovieDetail {...(movieIdMatch?.params as { id: string })} />
            </DetailWrapper>
          ) : tvIdMatch?.params.id ? (
            <DetailWrapper
              variants={movieVariants}
              initial="initial"
              animate="show"
              exit="exit"
              transition={{ type: "tween" }}
            >
              <TvDetail {...(tvIdMatch.params as { id: string })} />
            </DetailWrapper>
          ) : null}
        </AnimatePresence>
      </Container>
    </>
  );
}
export default Modal;
