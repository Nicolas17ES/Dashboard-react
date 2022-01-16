import React from 'react';
import { useLocation } from 'react-router-dom';
import './FlightInfo.css'


const FlightInfo = () => {

    const { state } = useLocation()
    console.log(state.data.data)
    const arrayFlights = state.data.data;

    return (

        <div className="flightCards">

            <section>
                <h1>Flight Results</h1>
                <div className="tbl-header">
                    <table cellpadding="0" cellspacing="0" border="0">
                        <thead>
                            <tr>
                                <th>Flight</th>
                                <th>Airline</th>
                                <th>Origin-Airport</th>
                                <th className="departure">Departure Time</th>
                                <th>Destination-Airport</th>
                                <th>Duration</th>
                                <th className="departure">Return</th>
                                <th>Price</th>
                                <th>Transfers</th>
                                <th>Buy</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div className="tbl-content">
                    <table cellpadding="0" cellspacing="0" border="0">
                        <tbody>
                            {arrayFlights.map((flight, index) => (
                                <tr>

                                    <td>{flight.flight_number}</td>
                                    <td>{flight.airline} </td>
                                    <td>{flight.origin}</td>
                                    <td className="departure">{flight.departure_at}</td>
                                    <td>{flight.destination}</td>
                                    <td>{flight.duration}</td>
                                    <td className="departure">{flight.return_at}</td>
                                    <td>{flight.price}</td>
                                    <td>{flight.transfers}</td>
                                    <td><a href={"https://www.aviasales.es" + flight.link} target="_blank" className="button-75" > BUY</a></td>


                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

export default FlightInfo
