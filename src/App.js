import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      articleIds: [],
      articlesDetails: [],
      rangeMin: 0,
      rangeMax: 50,
      articleUrl: undefined
    }
  }

  componentDidMount() {
    this.getArticleIds();
  }

  getArticleIds() {
    axios({
      url: '/topstories.json',
      baseURL: 'https://hacker-news.firebaseio.com/v0',
      responseType: 'json'
    }).then((response) => {
        if (!response.data) {
          console.log("response lacking data", response);
          return;
        }
        console.log('Received list of top stories. Total items in list: ' + response.data.length);
        this.setState({ articleIds: response.data });
        this.getArticlesDetails();
    });
  }

  getArticlesDetails() {
    var articlesDetails = [];
    this.state.articleIds.map((articleId, idx) => {
      if (idx >= this.state.rangeMin && idx < this.state.rangeMax) {
        axios({
            url: `/${articleId}.json`,
            baseURL: 'https://hacker-news.firebaseio.com/v0/item',
          }).then((response) => {
              articlesDetails.push(response.data);
              this.setState({ articlesDetails: articlesDetails });
          })
      }

    });
    console.log('successful getListItems'); // `array-callback-return` should not trigger for async functions
  }

  renderArticleList() {
    if (this.state.articlesDetails) {
      const list = this.state.articlesDetails.map((article, idx) => {
        return (
          <li key={article.id} onClick={() => {this.setArticleUrl(article.url)}}>
            <span className="article-title">{article.title}</span> <br />
            <span className="article-info">{article.score} points by
              <span className="article-author">{article.by}</span>
            </span>
          </li>
        );
      });
      return list;
    }
    else {

    }
  }

  setArticleUrl(url) {
    this.setState({
      articleUrl: url
    });
  }

  renderArticle() {
    let iframe;
    if (this.state.articleUrl) {
      iframe = (
          <iframe src={this.state.articleUrl}></iframe>
      )
      return iframe;
    } else {
      return (
        <div>
          <p>No story selected</p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">

        </div>
        <div className="article-list">
          {this.renderArticleList()}
        </div>
        <div className="article-content">
          {this.renderArticle()}
        </div>
      </div>
    );
  }
}

export default App;
