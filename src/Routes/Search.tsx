import React, { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useMatch } from "react-router-dom";
import { getSearch, IGetSearch } from "../api";

function Search() {
  const match = useMatch("/search/:searchValue");
  const { data, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteQuery<IGetSearch>(
      [match?.params.searchValue],
      ({ pageParam = 1 }) =>
        getSearch(match?.params.searchValue as string, pageParam),
      {
        getNextPageParam: (lastPage) => {
          const nextPage = lastPage.page + 1;
          // getNextPageParam의 리턴값이 hasNextPage로 넘어감
          // 다음페이지가 총 페이지보다 많거나 페이지 수가 20개를 넘으면 false를 리턴
          return nextPage > lastPage.total_pages || nextPage > 20
            ? false
            : nextPage;
        },
      }
    );
  useEffect(() => {
    // 다음페이지가 있으면 계속 불러오기 (total page까지)
    if (hasNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, data?.pages]);
  return (
    <>
      {data ? (
        <>
          {data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.results.map((movie, i) => (
                <p key={i}>
                  {movie.popularity < 20
                    ? null
                    : "title" in movie
                    ? movie.title
                    : movie.name}
                </p>
              ))}
            </React.Fragment>
          ))}
        </>
      ) : null}
    </>
  );
}

export default Search;
