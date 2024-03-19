export interface rtnList {
    id: number,
    name: string,
    media_type: string,
    poster_path: string,
    genre_ids: Array<28|12|16|35|80|99|18|10751|14|36|27|10402|9648|10749|878|10770|53|10752|37>|Array<10759|16|35|80|99|18|10751|10762|9648|10763|10764|10765|10766|10767|10768|37>,
    release_date: string,
    vote_average: number,
}

export interface rgbColor {
    r: number,
    g: number,
    b: number
}

export interface nowPlayingMovie {
    id: number,
    backdrop_path: string,
    genre_ids: Array<28 | 12 | 16 | 35 | 80 | 99 | 18 | 10751 | 14 | 36 | 27 | 10402 | 9648 | 10749 | 878 | 10770 | 53 | 10752 | 37 | 10759 | 10762 | 10763 | 10764 | 10765 | 10766 | 10767 | 10768>,
    title: string,
    overview: string,
    vote_average: number
}

export interface keyword {
    id: number,
    title: string,
    name: string,
    media_type: 'movie' | 'tv' | 'person',
}