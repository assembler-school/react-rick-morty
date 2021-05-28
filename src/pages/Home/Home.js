import React, { Component } from "react";
import { getTitleEpisodes } from "../../api";
import Layout from "../../components/Layout";
import EpisodeCard from "../../components/EpisodeCard";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      paginationInfo: null,
      episodes: [],
      hasLoaded: false,
      hasError: false,
      errorMessage: null,
    };

    this.loadEpisodes = this.loadEpisodes.bind(this);
    this.loadPage = this.loadPage.bind(this);
  }

  componentDidMount() {
    const { page } = this.state;
    this.loadEpisodes(page);
  }

  componentDidUpdate(_prevProps, prevState) {
    const { page: prevPage } = prevState;
    const { page } = this.state;

    if (prevPage !== page) {
      this.loadEpisodes(page);
    }
  }

  async loadEpisodes(page) {
    try {
      const { data } = await getTitleEpisodes(page);
      this.setState((prevState) => ({
        paginationInfo: data.info,
        episodes: [...prevState.episodes, ...data.results],
        hasLoaded: true,
      }));
    } catch (error) {
      this.state({
        hasLoaded: true,
        hasError: true,
        errorMessage: error.message,
      });
    }
  }

  loadPage() {
    this.setState((prevState) => ({
      page: prevState.page + 1,
    }));
  }

  render() {
    const {
      paginationInfo,
      episodes,
      hasLoaded,
      hasError,
      errorMessage,
    } = this.state;

    return (
      <Layout>
        <section className="row">
          {hasLoaded && !hasError && (
            <div className="col col-12">
              <h1>Episodes loaded!</h1>
            </div>
          )}
          {hasError && (
            <div className="col col-12">
              <h1>Something went wrong...</h1>
              <p>{errorMessage}</p>
            </div>
          )}
          {!hasLoaded && (
            <div className="col col-12">
              <h1>Loading episodes...</h1>
            </div>
          )}
          <div className="col col-12">
            <hr />
          </div>

          {episodes.length > 0 &&
            episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                id={episode.id}
                name={episode.name}
                airDate={episode.air_date}
                episode={episode.episode}
              />
            ))}
          <div className="col col-12">
            <hr />
          </div>
          <div className="col col-12">
            <button
              className="btn btn-success"
              type="button"
              disabled={paginationInfo && !paginationInfo.next}
              onClick={this.loadPage}
            >
              Load more
            </button>
          </div>
        </section>
      </Layout>
    );
  }
}

export default Home;
