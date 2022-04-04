import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { searchState } from "../atoms";
import Nav from "../Components/Nav";

const Article = styled.div`
  width: 100%;
  height: 200vh;
  background-color: darkgray;
`;
function TvShow() {
  const setSearch = useSetRecoilState(searchState);
  const searchClick = () => {
    setSearch(false);
  };
  return (
    <div>
      <Nav />
      <Article onClick={searchClick} />
    </div>
  );
}

export default TvShow;
