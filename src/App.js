import React, { Component } from 'react';
import axios from 'axios';
import { sortBy } from 'lodash';
import classnames from 'classnames';
import './App.css';
import PropTypes from 'prop-types';

// Goodreads api URL constants and default parameters
const DEFAULT_QUERY = 'sapiens';
const DEFAULT_NUM_HITS = 20;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_NUM_HITS = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

class App extends Component {
  call = null; // The call we make to the api using axios

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',                // The most recent submitted searchTerm to the API, used to implement the client-side cache.
      searchTerm: DEFAULT_QUERY,    // Fluctuant variable, it changes as user types in the search field.
      hasError: false,
      isLoading: false,
    };

  }
  
  setSearchResult = (result) => {
    const {hits, page} = result;
    const {searchKey, results} = this.state;

    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: {...results, [searchKey]: {hits: updatedHits, page}},
      isLoading: false,
    });
  }

  // Configure axios to make the call to the api only when there's no pending request.
  makeCall = (config = {}) => {
    if (this.call) this.call.cancel("Only one request at a time.");
    this.call = axios.CancelToken.source();
    config.cancelToken = this.call.token;
    return axios(config);
  }

  fetchSearchResult = (searchKey, page = 0) => {
    this.setState({isLoading: true});
    const requestConfig = {
      method: "get",
      url: `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchKey}&${PARAM_PAGE}${page}&${PARAM_NUM_HITS}${DEFAULT_NUM_HITS}`,
      timeout: 10000
    }
   this.makeCall(requestConfig)
      .then(result => this.setSearchResult(result.data))
      .catch(error => this.setState({hasError: true})); 
  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchResult(this.state.searchKey);
  }

  componentDidCatch(error, info) {
    this.setState({hasError: true});
    // TODO: log the error to the service
  }

  onSearchSubmit = (event) => {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    if (this.needNewSearch(searchTerm)) {
      this.fetchSearchResult(searchTerm);         // Must pass searchTerm to the fetch function, not searchKey
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
    const {searchTerm, results, searchKey, hasError, isLoading} = this.state;
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
          hasError ? <p>Unable to fetch articles.</p> :
          <Table
            list={list}
            onDismiss={this.onDismiss}
          />
        }
        <ButtonWithLoading
          isLoading={isLoading}
          onClick={() => this.fetchSearchResult(searchKey, page + 1)}>
          more
        </ButtonWithLoading>
      </div>
    );
  }
}

class Search extends Component {
  constructor(props) {
    super(props);
    this.searchInput = null;

    this.setSearchInputRef = element => {
      this.searchInput = element;
    };

    this.focusSearchInput = () => {
      if (this.searchInput) this.searchInput.focus();
    };
  }

  componentDidMount() {
    this.focusSearchInput();
  }

  render() {
    const {value, onChange, onSearchSubmit, children} = this.props;

    return (
      <form onSubmit={onSearchSubmit}>
        <input 
          type="text"
          value={value}
          onChange={onChange}
          ref={this.setSearchInputRef}
        />
        <Button 
          type="submit"
          onClick={onSearchSubmit}>
          {children}
        </Button>
      </form>
    );
  }
}
  

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearchSubmit: PropTypes.func,
  children: PropTypes.node,
};


class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };
  }

  onSort = (sortKey) => {
    const isSortReverse = (this.state.sortKey === sortKey && !this.state.isSortReverse);
    this.setState({sortKey, isSortReverse});
  }

  render() {
    const {list, onDismiss} = this.props;
    const {sortKey, isSortReverse} = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;

    return(
      <div className="table">
        <div className="table-header">
          <span>
            <Sort 
              sortKey={'TITLE'}
              activeSortKey={sortKey}
              onSort={this.onSort}
            >Title</Sort>
            <Sort 
              sortKey={'AUTHOR'}
              activeSortKey={sortKey}
              onSort={this.onSort}
            >Author</Sort>
            <Sort 
              sortKey={'COMMENTS'}
              activeSortKey={sortKey}
              onSort={this.onSort}
            >Comments</Sort>
            <Sort 
              sortKey={'POINTS'}
              activeSortKey={sortKey}
              onSort={this.onSort}
            >Points</Sort>
          </span>
        </div>
        {reverseSortedList.map(item =>
          <div key={item.objectID} className="table-row">
            <span>{item.title}</span>
            <span>
              <a href=''>{item.author}</a>
            </span>
            &nbsp;
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
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
    );
  }

} 



Table.propTypes = {
  list: PropTypes.array.isRequired,
  onDismiss: PropTypes.func,
};

const Sort = ({sortKey, activeSortKey, onSort, children}) => {
  const sortClass = classnames(
    'button-inline',
    {'button-active': sortKey === activeSortKey}
  );

  return (
    <Button 
      onClick={() => onSort(sortKey)}
      className={sortClass}>
      {children}
    </Button>
  );
}


const Button = ({onClick, className="button-inline", children}) => 
  <button 
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  className: '',
};


const LoadingIndicator = () => 
  <div>
    Loading...
  </div>

// HOC to render either the loading indicator or the passed in component
const withLoading = (Component) => ({isLoading, ...rest}) => 
  isLoading 
  ? <LoadingIndicator /> 
  : <Component {...rest} />


const ButtonWithLoading = withLoading(Button);

export default App;

export {Search, Table, Button};






















