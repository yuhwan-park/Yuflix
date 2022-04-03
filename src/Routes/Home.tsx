import styled from "styled-components";
import Nav from "../Components/Nav";

const Article = styled.div`
  width: 100%;
  height: 200vh;
  background-color: darkgray;
`;

function Home() {
  return (
    <>
      <Nav />
      <Article>Home</Article>
    </>
  );
}

export default Home;
