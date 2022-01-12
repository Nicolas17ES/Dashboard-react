import React, { Component, useState } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import "bootstrap/dist/css/bootstrap.min.css";
import './GoogleMaps.css'



export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            showingInfoWindow: false,
            show: false,
            service_id: "",
            activeMarker: {},
            selectedPlace: {},
            mapCenter: {
                lat: 41.385063,
                lng: 2.173404,
            }
        }
        this.getServiceId();
    };

    getServiceId = async () => {
        const response = await fetch('http://localhost:3001/services/GoogleMaps');
        const data = await response.json();
        console.log(data)
        this.setState({ service_id: data.service_id })
    }



    addServiceToDashboard = async () => {
        const user_id = this.props.user.user_id
        const service_id = this.state.service_id;
        console.log(service_id)
        await fetch('http://localhost:3001/user/dashboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                service_id,
                user_id,
            })
        });
    }

    deleteServiceFromDashboard = async () => {
        const user_id = this.props.user.user_id
        const service_id = this.state.service_id;
        await fetch('http://localhost:3001/user/dashboard', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                service_id,
                user_id,
            })
        });
    }

    handleClose = () => {
        this.setState({ show: false })
        console.log(this.state.show)

    }

    handleShow = () => {
        this.setState({ show: true })
        console.log(this.state.show)

    }

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                console.log('Success', latLng);
                this.setState({ address });
                this.setState({ mapCenter: latLng });
            })

            .catch(error => console.error('Error', error));
    };

    render() {
        return (
            <div id="googleMap" className="maps">
                <span className="tag-news tag-teal">GOOGLE MAPS</span>
                <button className="button-74" onClick={this.handleShow}> Search Locations</button>
                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <ModalHeader closeButton>
                        <ModalTitle>Google Maps Searcher</ModalTitle>
                    </ModalHeader>
                    <ModalBody className="modal-body2">
                        <div className="container3">
                            <PlacesAutocomplete
                                value={this.state.address}
                                onChange={this.handleChange}
                                onSelect={this.handleSelect}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div>
                                        <input
                                            {...getInputProps({
                                                placeholder: 'Search Places ...',
                                                className: 'location-search-input',
                                            })}
                                        />
                                        <div className="autocomplete-dropdown-container">
                                            {loading && <div>Loading...</div>}
                                            {suggestions.map(suggestion => {
                                                const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';
                                                // inline style for demonstration purpose
                                                const style = suggestion.active
                                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                        })}
                                                    >
                                                        <span>{suggestion.description}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </PlacesAutocomplete>


                            <Map google={this.props.google}
                                initialCenter={
                                    {
                                        lat: this.state.mapCenter.lat,
                                        lng: this.state.mapCenter.lng,
                                    }
                                }
                                center={{
                                    lat: this.state.mapCenter.lat,
                                    lng: this.state.mapCenter.lng,
                                }}
                                zoom={10}
                                style={{ width: '93%', height: '55%' }}>
                                <Marker
                                    position={{
                                        lat: this.state.mapCenter.lat,
                                        lng: this.state.mapCenter.lng,
                                    }}
                                />


                            </Map>
                        </div>
                    </ModalBody>
                    <ModalFooter>

                        <button className="button-74" onClick={this.handleClose}>
                            Close
                    </button>
                    </ModalFooter>
                </Modal>
                {this.props.exists ? <div onClick={this.deleteServiceFromDashboard} className="minus radius"></div> : <div onClick={this.addServiceToDashboard} className="plus radius"></div>}
            </div>)
    }
}
export default GoogleApiWrapper({
    apiKey: 'AIzaSyC-rnH40h0kp4A8ipEBpQJ2s6TTjrSWBNs'
})(MapContainer)


// class MapsContainer extends Component {
//     render() {
//         return (
//             <div className="maps">
//                 <span className="tag-maps tag-teal">Google Maps</span>
//                 <div className="card-header">

//                     <p>Search for any location of interest</p>
//                 </div>
//                 <div className="card-body-maps">
//                     <div className="container3">

//                         <Map
//                             google={this.props.google}
//                             style={{ width: "20%", height: "20%" }}
//                             zoom={10}
//                             initialCenter={
//                                 {
//                                     lat: 41.385063,
//                                     lng: 2.173404,
//                                 }
//                             }
//                             scaleControl={true}
//                         />


//                     </div>
//                 </div>
//             </div>
//         )
//     }
// };

// export default GoogleApiWrapper({
//     apiKey: "AIzaSyC-rnH40h0kp4A8ipEBpQJ2s6TTjrSWBNs"
// })(MapsContainer)



