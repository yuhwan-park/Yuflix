import { motion } from "framer-motion";
import styled from "styled-components";

const Modal = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: red;
  margin: 0 auto;
  width: 50vw;
  height: 500px;
`;

function MovieModal() {
  return <Modal />;
}

export default MovieModal;
