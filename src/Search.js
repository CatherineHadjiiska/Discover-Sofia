import React, { Component } from "react";
import Sites from "./Sites";
import "./App.css";

class Search extends Component {
  render() {
    return (
      <div>
        {this.props.matchedSite.map(site => {
          return (
            <Sites
              key={site.venue.id}
              markers={this.props.markers}
              site={site}
              populateInfoWindow={this.props.populateInfoWindow}
              openInfoWindow={this.props.openInfoWindow}
            />
          );
        })}
      </div>
    );
  }
}
export default Search;