import React, { useState, useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { useNavigate } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";
import './Skyscanner.css'

const Skyscanner = (props) => {
    let navigate = useNavigate();

    const [currency, setCurrency] = useState('');
    const [one_way, setOneWay] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departure_at, setDepartureAt] = useState('');
    const [return_at, setReturnAt] = useState('');
    const [direct, setDirect] = useState(false);
    const [adults, setAdults] = useState('');
    const [children, setChildren] = useState('');
    const [tripCLass, setCLass] = useState('');
    const [show, setShow] = useState(false);
    const [service_id, setId] = useState();



    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        if (props != undefined) {
            (
                async () => {
                    const response = await fetch('http://localhost:3001/services/FlightSearch');
                    const data = await response.json();
                    setId(data.service_id)
                }
            )();
        }

    });

    const addServiceToDashboard = async () => {
        const user_id = props.user.user_id
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

    const deleteServiceFromDashboard = async () => {
        const user_id = props.user.user_id
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


    const submit = async (e) => {

        e.preventDefault();

        const response = await fetch("http://localhost:3001/user/dashboard/flights/search", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currency,
                one_way,
                origin,
                destination,
                departure_at,
                return_at,
                direct,
            })
        });
        const data = await response.json();
        navigate('/userDasboard/flights', { state: { data } })
    }

    return (
        <div className="flights">

            <span className="tag-news tag-teal">News App</span>
            <button className="button-74" onClick={handleShow}> Search Flights</button>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <ModalHeader closeButton>
                    <ModalTitle>SEARCH FLIGHTS</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div id="search-form">
                        <section>
                            <div className="flight" id="flightbox">

                                <form onSubmit={submit} id="flight-form">
                                    {/* CURRENCY */}
                                    <div id="currency-type">
                                        <div className="info-box">
                                            <input type="radio" name="currency-type" value="rub" id="rub" checked onChange={e => setCurrency(e.rget.value)} checked />
                                            <label htmlFor="rub">RUB</label>
                                        </div>
                                        <div className="info-box">
                                            <input type="radio" name="currency-type" value="usd" id="eur" checked onChange={e => setCurrency(e.rget.value)} />
                                            <label htmlFor="usd">€EURO</label>
                                        </div>
                                        <div className="info-box">
                                            <input type="radio" name="currency-type" value="eur" id="usd" onChange={e => setCurrency(e.target.value)} />
                                            <label htmlFor="eur">$DOLLAR</label>
                                        </div>
                                    </div>
                                    {/* <!-- TRIP TYPE --> */}
                                    <div id="flight-type">
                                        <div className="info-box">
                                            <input type="radio" name="flight-type" value="false" id="return" onChange={e => setOneWay(e.target.value)} checked />
                                            <label htmlFor="return">RETURN</label>
                                        </div>
                                        <div className="info-box">
                                            <input type="radio" name="flight-type" value="true" id="one-way" onChange={e => setOneWay(e.target.value)} />
                                            <label htmlFor="one-way">ONE WAY</label>
                                        </div>
                                    </div>
                                    <div id="flight-type">
                                        <div className="info-box">
                                            <input type="checkbox" name="direct" value="true" id="direct" onChange={e => setDirect(e.target.value)} />
                                            <label htmlFor="direct">ONLY DIRECT FLIGHTS</label>
                                        </div>
                                    </div>

                                    {/* <!-- FROM/TO --> */}
                                    <div id="flight-depart">
                                        <div className="info-box">
                                            <label htmlFor="">LEAVING FROM</label>
                                            <input type="text" id="dep-from" onChange={e => setOrigin(e.target.value)} />
                                            <div id="depart-res"></div>
                                        </div>
                                        <div className="info-box" id="arrive-box">
                                            <label htmlFor="">ARRIVING AT</label>
                                            <input type="text" id="dep-to" onChange={e => setDestination(e.target.value)} />
                                            <div id="arrive-res"></div>
                                        </div>
                                    </div>

                                    {/* <!-- FROM/TO --> */}
                                    <div id="flight-dates">
                                        <div className="info-box">
                                            <label htmlFor="">LEAVING ON</label>
                                            <input className="dates" type="date" id="leave-date" onChange={e => setDepartureAt(e.target.value)} />
                                        </div>
                                        <div className="info-box" id="return-box">
                                            <label htmlFor="">RETURNING ON</label>
                                            <input className="dates" type="date" id="return-date" onChange={e => setReturnAt(e.target.value)} />
                                        </div>
                                    </div>

                                    {/* <!-- PASSENGER INFO --> */}
                                    <div id="flight-info">
                                        <div className="info-box">
                                            <label htmlFor="adults">ADULTS</label>
                                            <select className="persons" name="adults" id="adults" onChange={e => setAdults(e.target.value)}>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                            </select>
                                        </div>
                                        <div className="info-box">
                                            <label htmlFor="children">CHILDREN</label>
                                            <select className="persons" name="children" id="children" onChange={e => setChildren(e.target.value)}>
                                                <option value="0">0</option>
                                                <option value="1">1</option>
                                                <option value="0">2</option>
                                                <option value="3">3</option>
                                            </select>
                                        </div>
                                        <div className="info-box">
                                            <label htmlFor="class-type">CLASS</label>
                                            <select name="class-type" id="class-type" onChange={e => setCLass(e.target.value)}>
                                                <option value="Economy">ECONOMY</option>
                                                <option value="Business">BUSINESS</option>
                                                <option value="First">FIRST CLASS</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* <!-- SEARCH BUTTON --> */}
                                    <div id="flight-search">
                                        <div className="info-box">
                                            <input type="submit" id="search-flight" value="SEARCH FLIGHTS" />
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </section>
                    </div>
                </ModalBody>
                <ModalFooter>

                    <button className="button-74" onClick={handleClose}>
                        Close
                    </button>
                </ModalFooter>
            </Modal>
            {props.exists ? <div onClick={deleteServiceFromDashboard} className="minus radius"></div> : <div onClick={addServiceToDashboard} className="plus radius"></div>}
        </div >

    )
}

export default Skyscanner

