import React, { Component } from 'react';
import './App.css';

// Goodreads api URL constants and default parameters
const DEFAULT_QUERY = 'sapiens';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';



const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };
    
  }
  
  setSearchTopBooks = (result) => {
    this.setState({result});
  }

  componentDidMount() {
    const {searchTerm} = this.state;

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(searchResult => searchResult.json())
      .then(jsonResult => this.setSearchTopBooks(jsonResult))
      .catch(error => error);  
  }

  onSearchChange = (event) => {
    this.setState({searchTerm: event.target.value});
  }

  onDismiss = (id) => {
    const updatedHits = this.state.result.hits.filter(item => item.objectID !== id);
    this.setState({result: {...this.state.result, hits: updatedHits}});
  }

  render() {
    const {searchTerm, result} = this.state;
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >
          Search for an HN article:
          </Search>
        </div>

        {
          // If there's no returned result from the api yet, don't render anything.
          result &&
          <Table
            list={result.hits}
            contentFilter={searchTerm}
            onDismiss={this.onDismiss}
          />
        }
        

      </div>
    );
  }
}

const Search = ({value, onChange, children}) => 
  <form>
    {children}
    <input 
      type="text"
      value={value}
      onChange={onChange}
    />
  </form>



const Table = ({list, contentFilter, onDismiss}) => 
  <div className="table">
    {list.filter(isSearched(contentFilter)).map(item =>
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
























