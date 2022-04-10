const API_KEY = "a33fb0f23a7a2315d40a03571b718261";
const DEFAULT_URL = "https://api.themoviedb.org/3/";

export interface IMovie {
  backdrop_path: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  id: number;
  vote_average: number;
  genre_ids: number[];
}
export interface ITvShow {
  id: number;
  backdrop_path: string;
  name: string;
  poster_path: string;
  vote_average: number;
  genre_ids: number[];
  first_air_date: string;
}
interface IVideo {
  type: string;
  key: string;
}
interface IGenre {
  id: number;
  name: string;
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
export interface IGetDatelessMovies {
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
export interface IGetVideo {
  id: number;
  results: IVideo[];
}
export interface IGetMovieDetail {
  backdrop_path: string;
  genres: IGenre[];
  id: number;
  title: string;
  overview: string;
  runtime: number;
  release_date: string;
  tagline: string;
  vote_average: number;
  poster_path: string;
}

export function getMovies(format: string, page: number) {
  return fetch(
    `${DEFAULT_URL}movie/${format}?api_key=${API_KEY}&language=ko-KR&page=${page}&region=KR`
  ).then((res) => res.json());
}
export function getMovieWithGenre(genre: number, page: number) {
  return fetch(
    `${DEFAULT_URL}discover/movie?api_key=${API_KEY}&language=ko-KR&page=${page}&region=KR&sort_by=popularity.desc&with_genres=${genre}`
  ).then((res) => res.json());
}
export function getTvshows(option: string) {
  return fetch(
    `${DEFAULT_URL}discover/tv?api_key=${API_KEY}&language=ko-KR${option}`
  ).then((res) => res.json());
}
export function getVideo(id: number, format: string) {
  return fetch(
    `${DEFAULT_URL}${format}/${id}/videos?api_key=${API_KEY}&language=ko-KR`
  ).then((res) => res.json());
}
export function getMovieDetail(id: string) {
  return fetch(
    `${DEFAULT_URL}movie/${id}?api_key=${API_KEY}&language=ko-KR`
  ).then((res) => res.json());
}
