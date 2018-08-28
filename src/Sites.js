import React, { Component } from "react";
import "./App.css";

class Sites extends Component {

	triggerInfoWindow = () =>
	this.props.markers.map(marker => {
		if (marker.id === this.props.site.venue.id) {
			this.props.populateInfoWindow(`
				<h3>${this.props.site.venue.name}</h3>
      <p>Address: ${this.props.site.venue.location.formattedAddress[0]} 
      ${this.props.site.venue.location.formattedAddress[1]} 
      ${this.props.site.venue.location.formattedAddress[2]}</p>`);
			this.props.openInfoWindow(marker);
			marker.setAnimation(window.google.maps.Animation.BOUNCE)
			setTimeout(() => {
				marker.setAnimation(null);
			}, 400);
		} else {
			marker.setAnimation(null);
		}
	});
	render() {
		const sights = `${this.props.site.venue.name}`;

		return (

			<div className="locations">
			<button onClick={this.triggerInfoWindow} role="navigation" aria-label="Discover more about the sight">
			{sights}
			</button>
			</div>
			);
	}
	}

export default Sites;
