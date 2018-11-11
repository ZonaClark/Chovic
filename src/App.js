import React, { Component } from 'react';
import logo from './logo.svg';
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
  }
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
  }
];

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cities,
      areas,
    };
  }


  render() {
    const title = 'Decide the areas you want to focus on:';
    return (
      <div className="App">
        <h2>{title}</h2>
        {this.state.areas.map(area =>
          <div key={area.objectID}>
            <span>
              <a href=''>{area.color}</a>
            </span>
            &nbsp;
            <span>{area.description}</span>
          </div>
        )}
      </div>
    );
  }
}

export default App;
