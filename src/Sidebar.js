import React, { Component } from "react";
import "./App.css";

class Sidebar extends Component {
  render() {
    return (
      <button
        id="button-sidebar"
        aria-label="Search for sights"
        role="navigation"
        onClick={this.props.triggerSidebar}
      >
        Search for Sights
      </button>
    );
  }
}

export default Sidebar;