import React, { Component } from 'react';
import './App.css';


// List of cities that have Chovic meetup
const cities = [
  {
    title: 'Charlottesville',
    host: 'Zona Li',
    numGroup: 1,
    objectID: 0,
  },
  {
    title: 'Washington D.C.',
    host: 'TBD',
    numGroup: 0,
    objectID:1,
  },
];



const areas = [
  {
    color: 'red',
    description: 'relationship',
    objectID: 0,
  },
  {
    color: 'orange',
    description: 'work',
    objectID: 1,
  },
  {
    color: 'yellow',
    description: 'growth',
    objectID: 2,
  },
  {
    color: 'green',
    description: 'contribution',
    objectID: 3,
  },
  {
    color: 'indigo',
    description: 'health',
    objectID: 4,
  },
  {
    color: 'blue',
    description: 'mind',
    objectID: 5,
  },
  {
    color: 'purple',
    description: 'finance',
    objectID: 6,
  },
];

const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cities,
      areas,
      searchTerm: '',
    };
    
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  onDismiss(id) {
    const updatedAreas = this.state.areas.filter(area => area.objectID !== id);
    this.setState({areas: updatedAreas});
  }

  render() {
    const {searchTerm, areas, cities} = this.state;
    return (
      <div className="App">
        <Topics
          areas={areas}
          onDismiss={this.onDismiss}
        />

        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
        >
          Search for a city:
        </Search>

        <Table
          cities={cities}
          contentFilter={searchTerm}
        />

      </div>
    );
  }
}

class Topics extends Component {
  render() {
    const {areas, onDismiss} = this.props;
    return (
      <div>
        <h2>Decide the areas you want to focus on:</h2>
        {areas.map(area =>
          <div key={area.objectID}>
            <span>
              <a href=''>{area.color}</a>
            </span>
            &nbsp;
            <span>{area.description}</span>
            <span>
              <Button 
                onClick={() => onDismiss(area.objectID)}
              >
                bubble
              </Button>
            </span>
          </div>
        )}
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



const Table = ({cities, contentFilter}) => 
  <div>
    {cities.filter(isSearched(contentFilter)).map(city =>
      <div key={city.objectID}>
        <span>
          <a href=''>{city.title}</a>
        </span>
        &nbsp;
        <span>{city.host}</span>
      </div>
    )}
  </div>
 

const Button = ({onClick, className='', children}) => 
  <button 
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>


export default App;
























