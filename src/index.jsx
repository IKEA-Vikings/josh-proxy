import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='app'>
        <div id='about'>
          {/* about component goes here! yay! */}
        </div>
        <div id='images'>

        </div>
        <Review />
      </div>
    );
  }
}

window.React = React;
window.ReactDOM = ReactDOM;
window.App = App;
