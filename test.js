import React, { Component } from 'react';
import './App.css';


// List of cities that have Chovic meetup
const cities = [
  {
    name: 'Charlottesville',
    host: 'Zona Li',
    numGroup: 1,
    objectID: 0,
  },
  {
    name: 'Washington D.C.',
    host: 'TBD',
    numGroup: 0,
    objectID:1,
  },
  {
    name: 'Boston',
    host: 'TBD',
    numGroup: 0,
    objectID:2,
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
    const block1 = 'Decide the areas you want to focus on:';
    const block2 = 'Choose a city:'
    return (
      <div className="App">
        <h2>{block1}</h2>
        {this.state.areas.map(area =>
          <div key={area.objectID}>
            <span>
              <a href=''>{area.color}</a>
            </span>
            &nbsp;
            <span>{area.description}</span>
            <span>
              <button 
                onClick={() => this.onDismiss(area.objectID)} 
                type="button">
                bubble
              </button>
            </span>
          </div>
        )}

        <h2>{block2}</h2>
        <form>
          <input 
            type="text" 
            onChange={this.onSearchChange}
          />
        </form>
        <div>{this.state.cities.filter(isSearched(this.state.searchTerm))}</div>
      </div>
    );
  }
}


export default App;