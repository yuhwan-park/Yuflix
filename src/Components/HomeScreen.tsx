import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { searchState } from "../atoms";
import { makeImage } from "../utils";
const Home = styled.div<{ bgImg: string }>`
  position: absolute;
  top: 0;
  left: -17px;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(20, 20, 20, 1)),
    url(${(props) => props.bgImg});
  background-size: cover;
  background-position: center center;
`;
const Title = styled.div`
  padding-left: 77px;
  font-size: 68px;
  font-weight: 700;
  text-shadow: 1px 3px 10px rgb(0 0 0);
`;
interface IHomeScreenProps {
  title: string | undefined;
  backdrop_path: string | undefined;
}
function HomeScreen({ title, backdrop_path }: IHomeScreenProps) {
  const setSearch = useSetRecoilState(searchState);
  const searchClick = () => {
    setSearch(false);
  };
  return (
    <Home onClick={searchClick} bgImg={makeImage(backdrop_path || "")}>
      <Title draggable="true">{title}</Title>
    </Home>
  );
}

export default HomeScreen;
