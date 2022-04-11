import { useEffect } from "react";
import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import { getSearch } from "../api";

function Search() {
  const match = useMatch("/search/:searchValue");
  const { data, isLoading } = useQuery(
    ["searchData", match?.params.searchValue],
    () => getSearch(match?.params.searchValue as string)
  );
  return null;
}

export default Search;
