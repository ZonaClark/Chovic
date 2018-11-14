import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

// Goodreads api URL constants and default parameters
const DEFAULT_QUERY = 'sapiens';
const DEFAULT_NUM_HITS = 20;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_NUM_HITS = 'hitsPerPage=';

class App extends Component {
  call = null; // The call we make to the api using axios

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
    };
    
  }
  
  setSearchResult = (result) => {
    const {hits, page} = result;
    const {searchKey, results} = this.state;

    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: {...results, [searchKey]: {hits: updatedHits, page}}
    });
  }


  makeCall = (config = {}) => {
    if (this.call) this.call.cancel("Only one request at a time.");
    this.call = axios.CancelToken.source();
    config.cancelToken = this.call.token;
    return axios(config);
  }

  fetchSearchResult = (searchKey, page = 0) => {
    const requestConfig = {
      method: "get",
      url: `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchKey}&${PARAM_PAGE}${page}&${PARAM_NUM_HITS}${DEFAULT_NUM_HITS}`,
      timeout: 10000
    }
   this.makeCall(requestConfig)
      .then(result => this.setSearchResult(result.data))
      .catch(error => this.setState({error})); 
  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchResult(this.state.searchKey);
  }

  onSearchSubmit = (event) => {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    if (this.needNewSearch(searchTerm)) {
      this.fetchSearchResult(this.state.searchKey);
    }
    event.preventDefault();
  }

  onSearchChange = (event) => {
    this.setState({searchTerm: event.target.value});
  }

  onDismiss = (id) => {
    const isNotId = item => item.objectID !== id;
    const {results, searchKey} = this.state;
    const {hits, page} = results[searchKey];
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {...results, [searchKey]: {hits: updatedHits, page}}
    });
  }

  needNewSearch = (searchTerm) => !this.state.results[searchTerm];

  render() {
    const {searchTerm, results, searchKey, error} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSearchSubmit={this.onSearchSubmit}
          >
          Search for an HN article
          </Search>
        </div>

        {
          error ? <p>Unable to fetch articles.</p> :
          <Table
            list={list}
            onDismiss={this.onDismiss}
          />
        }
        
        <Button onClick={() => this.fetchSearchResult(searchKey, page + 1)}>more</Button>

      </div>
    );
  }
}

const Search = ({value, onChange, onSearchSubmit, children}) => 
  <form onSubmit={onSearchSubmit}>
    <input 
      type="text"
      value={value}
      onChange={onChange}
    />
    <Button 
      type="submit"
      onClick={onSearchSubmit}>
      {children}
    </Button>
  </form>



const Table = ({list, onDismiss}) => 
  <div className="table">
    {list.map(item =>
      <div key={item.objectID} className="table-row">
        <span>
          <a href=''>{item.author}</a>
        </span>
        &nbsp;
        <span>{item.num_comments}</span>
        <span>
          <Button 
            onClick={() => onDismiss(item.objectID)}
          >
            dismiss
          </Button>
        </span>
      </div>
    )}
  </div>
 

const Button = ({onClick, className='', children}) => 
  <button 
    onClick={onClick}
    className="button-inline"
    type="button"
  >
    {children}
  </button>


export default App;
























