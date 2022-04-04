const API_KEY = "a33fb0f23a7a2315d40a03571b718261";
const DEFAULT_URL = "https://api.themoviedb.org/3/";

interface IMovie {
  backdrop_path: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  id: number;
}
interface ITvShow {
  id: number;
  backdrop_path: string;
  name: string;
  poster_path: string;
}

export interface IGetMovies {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetTvShows {
  page: number;
  results: ITvShow[];
  total_pages: number;
  total_results: number;
}

export function getMovies(format: string) {
  return fetch(
    `${DEFAULT_URL}movie/${format}?api_key=${API_KEY}&language=ko-KR&page=1`
  ).then((res) => res.json());
}
export function getTvshows(format: string) {
  return fetch(
    `${DEFAULT_URL}tv/${format}?api_key=${API_KEY}&language=ko-KR&page=1`
  ).then((res) => res.json());
}
