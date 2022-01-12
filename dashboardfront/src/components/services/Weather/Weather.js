import React, { useState, useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import "bootstrap/dist/css/bootstrap.min.css";
import './Weather.css'

const Weather = (props) => {

    const apiKey = '327d4b77ce2f07fffe3f751e17d45049';
    const [weatherData, setWeatherData] = useState([{}]);
    const [city, setCity] = useState("");
    const [service_id, setId] = useState();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(() => {
        if (props != undefined) {
            (
                async () => {
                    const response = await fetch('http://localhost:3001/services/Weather');
                    const data = await response.json();
                    setId(data.service_id)
                }
            )();
        }

    });

    const getWeather = async (event) => {
        if (event.key === "Enter") {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            setWeatherData(data);
            setCity("");
        }
    }



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



    return (
        <div className="card weather">

            <span className="tag tag-teal">Weather App</span>
            <button className="button-74" onClick={handleShow}> Click for weather</button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <ModalHeader closeButton>
                    <ModalTitle>WEATHER</ModalTitle>
                </ModalHeader>
                <ModalBody>

           
                        <div className="container2">
                            <input
                                className="input"
                                placeholder="Enter city..."
                                onChange={e => setCity(e.target.value)}
                                value={city}
                                onKeyPress={getWeather}
                            />

                            {typeof weatherData.main === 'undefined' ? (
                                <div>
                                    <p className="title"> Check the weather of your city</p>
                                </div>
                            ) : (
                                    <div className="weather-data">
                                        <p className="city">{weatherData.name}</p>
                                        <p className="temp">{Math.round(weatherData.main.temp)}Cº</p>
                                        <p className="weather">{weatherData.weather[0].main}</p>
                                    </div>
                                )}
                            {weatherData.cod === '404' ? (
                                <p>City not found</p>
                            ) : (
                                    <>
                                    </>
                                )}
                        </div>                            
                </ModalBody>
                <ModalFooter>

                    <button className="button-74" onClick={handleClose}>
                        Close
                    </button>
                </ModalFooter>
            </Modal>
            {props.exists ? <div onClick={deleteServiceFromDashboard} className="minus radius"></div> : <div onClick={addServiceToDashboard} className="plus radius"></div>}

        </div>
    )
};

export default Weather;



