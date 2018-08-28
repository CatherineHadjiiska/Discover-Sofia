import React, { Component } from "react";
import "./App.css";
import Search from "./Search";
import Sidebar from "./Sidebar";


import axios from "axios";
import escapeRegExp from "escape-string-regexp";

// Google Maps Authentication error
window.gm_authFailure = () => {
  alert("Oops, something went wrong! Please check your Google API key!");
};

class App extends Component {
  state = {
    venues: [],
    matchedSite: [],
    markers: [],
    query: "",
    openSearch: false,
  };

  componentDidMount() {
    this.getData();
  }


  renderMap = () => {
    loadScript(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAtG0Ps2kXa-IWaGlwCSYAvGJW57czVJhY&callback=initMap"
    );
    window.initMap = this.initMap;
  };

  // retrieve Foursquare data
  getData = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id: "BYPED4DKYUOMTITESSML522I4FJ3QMWTY2ICHSXCNEKJEO5W",
      client_secret: "20GEDDG5M4SKNFTX0PRV5ZC3BSHFQDZZNCZCVAQOTTYO4XLZ",
      query: "sights",
      limit: 10,
      near: "Sofia",
      v: "20182008"
    };

    axios
      .get(endPoint + new URLSearchParams(parameters))
      .then(resp => {
        this.setState(
          {
            venues: resp.data.response.groups[0].items,
            matchedSite: resp.data.response.groups[0].items
          },
          this.renderMap()
        );
      })
      .catch(error => {
        console.log("ERROR", error);
        alert("Error! Retrieving data from Foursquare failed. Please try again.")
      });
  };

  map = null;
  infoWindow = null;



// Open infowindow
  openInfoWindow = marker => {
    if (this.infoWindow) this.infoWindow.open(this.map, marker);
  };

  //fill infowindow
  populateInfoWindow = contentString => {
    if (this.infoWindow) this.infoWindow.setContent(contentString);
  };



  // Create a map
  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 42.698334, lng: 23.319941 },
      zoom: 14
    });

    this.map = map;

    // Create an info window
    const infoWindow = new window.google.maps.InfoWindow();
    this.infoWindow = infoWindow;

    // Display dynamic markers
    this.createMarker();
  };

  //refactor Markers

  createMarker = () => {
    const newMarker = [];

    this.state.venues.map(site => {
      const { lat, lng } = site.venue.location;
      this.lat = lat;
      this.lng = lng;
      const contentString = `<h3>${site.venue.name}</h3>
      <p>Address: ${site.venue.location.formattedAddress[0]} 
      ${site.venue.location.formattedAddress[1]} 
      ${site.venue.location.formattedAddress[2]}</p>`;

      // Create marker
      const marker = new window.google.maps.Marker({
        position: {
          lat: lat,
          lng: lng
        },
        map: this.map,
        title: site.venue.name,
        id: site.venue.id,
        animation: window.google.maps.Animation.DROP
      });

      // Click on marker
      marker.addListener("click", () => {
        // Change the content
        this.populateInfoWindow(contentString);

        // Open an info window
        this.openInfoWindow(marker);
      });
      // Bounce effect on mouse over
      marker.addListener("click", () => {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(function() {
            marker.setAnimation(null)
          }, 400)
        }
      });

      newMarker.push(marker);
    });
    this.setState({ markers: newMarker });
  };

  // show the search box
  showSearch = query => {
    this.setState({ query }, this.siteSearch);
  };

  //filter sites on input

  siteSearch = query => {
    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), "i");

      this.setState(
        {
          matchedSite: this.state.venues.filter(site =>
            match.test(site.venue.name)
          )
        },
        this.updateVisibility
      );
    } else {
      this.setState({ matchedSite: this.state.venues }, this.updateVisibility);
    }
  };

  updateVisibility = () => {
    this.state.markers.forEach(marker => {
      const isVisible = this.state.matchedSite.find(
       site => site.venue.id === marker.id
      );
      marker.setMap(isVisible ? this.map : null);
    });
  };

  // Open/Hide/Fill sidebar function
  triggerSidebar = () => {
    const sidebarIsOpen = this.state.openSearch;

    this.setState({ openSearch: !sidebarIsOpen });
  };

  render() {
      return (
        <main role="application">
          <h1 className="title">Discover Sofia</h1>
          <Sidebar triggerSidebar={this.triggerSidebar} />
          <div id="map" aria-labelledby="map" />
          {this.state.openSearch && (
            <div className="search">
            <label htmlFor="search-input">Filter</label>            
              <input
                className="search-input"
                id="search-input"
                type="text"
                placeholder="Search for sights"
                value={this.state.query}
                onChange={e => this.showSearch(e.target.value)}
                />

              <Search
                venues={this.state.venues}
                matchedSite={this.state.matchedSite}
                markers={this.state.markers}
                lat={this.lat}
                lng={this.lng}
                populateInfoWindow={this.populateInfoWindow}
                openInfoWindow={this.openInfoWindow}
              />
            </div>
        
           )}
        </main>
      );
    }
  }


function loadScript(url) {
  const index = window.document.getElementsByTagName("script")[0];
  const script = window.document.createElement("script");
  script.src = url;
  script.onerror = () => {
    document.getElementById("map").innerHTML =
      "Error occured when loading the map. Please try again.";
  };
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
