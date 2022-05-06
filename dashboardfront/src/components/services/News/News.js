import React, { useState, useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import "bootstrap/dist/css/bootstrap.min.css";
import './News.css'

const News = (props) => {
    const apiKey = 'cb2626881f7d42f6a28daeefb5011eb0';
    const [newsData, setNewsData] = useState([{}]);
    const [keyword, setKeyword] = useState("");
    let [newsNumber, setNewsNumber] = useState(0);
    const [show, setShow] = useState(false);
    const [service_id, setId] = useState();


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        if (props != undefined) {
            (
                async () => {
                    const response = await fetch('http://localhost:3001/services/News');
                    const data = await response.json();
                    setId(data.service_id)
                }
            )();
        }

    });


    const getNews = async (event) => {
        if (event.key === "Enter") {
            const response = await fetch(`https://newsapi.org/v2/everything?q=${keyword}&apiKey=${apiKey}`);
            const data = await response.json();
            setNewsData(data.articles[newsNumber]);
        }
    }

    const nextNew = async () => {
        let number = (newsNumber + 1)
        if (number === 19) {
            setNewsNumber(0);
        }
        setNewsNumber(number);
        const response = await fetch(`https://newsapi.org/v2/everything?q=${keyword}&apiKey=${apiKey}`);
        const data = await response.json();
        setNewsData(data.articles[number]);
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

        <div className=" news">

            <span className="tag-news tag-teal">News App</span>
            <button className="button-74" onClick={handleShow}> Access to news</button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <ModalHeader closeButton>
                    <ModalTitle>DAILY NEWS</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className="card-header">

                        {newsNumber != 0 ? <img src={newsData.urlToImage} alt="rover" /> : <img src="https://images.unsplash.com/photo-1586880234202-32a56790c681?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTgwfHxuZXdzcGFwZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60" alt="rover" />}

                    </div>
                    <div className="card-body">

                        <div className="container2">
                            <div className="group">      
                                <input placeholder="Search for news..."
                                onChange={e => setKeyword(e.target.value)}
                                value={keyword}
                                onKeyPress={getNews}
                                className="input-contact" 
                                type="text"
                                ></input>
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label className="label-contact">Name</label>
                            </div>
                       
                            {typeof newsData === '' ? (
                                <div>
                                    <p className="title">Look for news</p>
                                </div>
                            ) : (
                                    <div className="news-data">
                                        <p className="title">{newsData.title}</p>
                                        <p className="description">{newsData.description}</p>
                                        <button onClick={nextNew} className="arrow">&#8594;</button>

                                    </div>
                                )}
                            {newsData === '404' ? (
                                <p>Keyword not found</p>
                            ) : (
                                    <>
                                    </>
                                )}
                        </div>

                    </div>
                </ModalBody>
                <ModalFooter>

                    <button className="button-74" onClick={handleClose}>
                        Close
                    </button>
                </ModalFooter>
            </Modal>
            {props.exists ? <div onClick={deleteServiceFromDashboard} className="minus radius"></div> : <div onClick={addServiceToDashboard} className="plus radius"></div>}
        </div >)
};

export default News;



