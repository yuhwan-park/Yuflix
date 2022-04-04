import { motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useMatch } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { searchState } from "../atoms";

const NavBar = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  height: 68px;
  justify-content: space-between;
  align-items: center;
  padding: 0 60px;
`;
const Logo = styled.svg`
  position: relative;
  height: 30px;
  width: 111px;
  color: rgba(229, 9, 20, 1);
  margin-right: 25px;
`;
const Links = styled.ul`
  display: flex;
  flex-direction: row;
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Item = styled.li<{ match: boolean }>`
  margin-left: 18px;
  a {
    color: ${(props) =>
      props.match ? "white" : props.theme.fontColor.lighter};
    font-size: 14px;
    transition: color 0.2s ease-in-out;
    font-weight: ${(props) => (props.match ? 700 : 500)};
    &:hover {
      color: ${(props) =>
        props.match ? "white" : props.theme.fontColor.darker};
    }
  }
`;
const Search = styled(motion.i)`
  z-index: 1;
  color: white;
  cursor: pointer;
  font-size: 18px;
  padding: 15px 10px;
`;
const Form = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  input {
    color: white;
    padding: 5px 10px;
    padding-left: 40px;
    font-size: 14px;
    border: 1px solid white;
    height: 35px;
    width: 300px;
    background-color: RGB(37, 35, 28);
    transform-origin: right center;
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

function Nav() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useViewportScroll();
  const homeMatch = useMatch("/");
  const tvMatch = useMatch("/tvshow");
  const [search, setSearch] = useRecoilState(searchState);
  const searchClick = () => {
    setSearch((prev) => !prev);
  };
  useEffect(() => {
    scrollYProgress.onChange(() => {
      setScrollY(scrollYProgress.get());
    });
  }, [scrollYProgress, setScrollY]);
  return (
    <NavBar
      animate={{
        background:
          scrollY > 0.01
            ? "linear-gradient(rgba(13, 13, 13, 1), rgba(13, 13, 13, 0.8))"
            : "linear-gradient(rgba(13, 13, 13, 0.6), rgba(13, 13, 13, 0))",
      }}
    >
      <Wrapper>
        <Link to={"/"}>
          <Logo>
            <path
              fill="currentColor"
              d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z"
            />
          </Logo>
        </Link>
        <Links>
          <Item match={Boolean(homeMatch)}>
            <Link to={"/"}>홈</Link>
          </Item>
          <Item match={Boolean(tvMatch)}>
            <Link to={"/tvshow"}>TV</Link>
          </Item>
        </Links>
      </Wrapper>
      <Form>
        <motion.input
          type="text"
          placeholder="제목, 사람, 장르"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: search ? 1 : 0 }}
          transition={{ type: "linear" }}
        />
        <Search
          onClick={searchClick}
          animate={{ x: search ? -300 : 0 }}
          transition={{ type: "linear" }}
          className="fa-solid fa-magnifying-glass"
        ></Search>
      </Form>
    </NavBar>
  );
}

export default Nav;
