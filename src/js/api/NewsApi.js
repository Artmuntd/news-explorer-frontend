import ErrorHandler from "../utils/ErrorHandler";

export default class NewsApi {
  constructor(newsUrl, apiKey, dateMin, dateMax) {
    this.apiKey = apiKey;
    this.newsUrl = newsUrl;
    this.dateMin = dateMin;
    this.dateMax = dateMax;
  }

  // date 2020-09-01
  getNews(topic) {
    return fetch(
      `${this.newsUrl}?q=${topic}&from=${this.dateMin}&to=${this.dateMax}&sortBy=date&language=ru&pageSize=100&apiKey=${this.apiKey}`,
    )
      .then((res) => {
        const result = res.json();
        return result;
        // ErrorHandler.errorThen(res);
      })
      .then((data) => {
        const articlesArray = data.articles;
        return articlesArray;
      })
      .catch((err) => ErrorHandler.errorCatch(err));
  }
}
