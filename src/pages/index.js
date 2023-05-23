import Head from 'next/head'
import Image from 'next/image'
import {Inter} from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {
    Button,
    ButtonGroup,
    Card, CardGroup,
    FormControl,
    FormSelect,
    FormText,
    InputGroup,
    Nav,
    ToggleButton
} from "react-bootstrap";
import {useEffect, useState} from "react";

const inter = Inter({subsets: ['latin']})

const customStyles = {
    'search-nav-link': {
        background: 'rgba(37, 70, 78, 0.65)',
        borderRadius: '20px 20px 0px 0px',
        color: '#FFFFFF',
        border: 'none',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        margin: '0px 10px 0px 10px'
    },
    'search-nav-link-active': {
        background: '#25464E',
        borderRadius: '20px 20px 0px 0px',
        color: '#000000',
        border: 'none',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        margin: '0px 10px 0px 10px'
    }

}


export default function Home() {
    const [activeButton, setActiveButton] = useState('left');
    const [budget, setBudget] = useState(0);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countries, setCountries] = useState([]);
    const [budgetCountries, setBudgetCountries] = useState(null);
    const [destination, setDestination] = useState(null);

    // fetch countries from the API when the page loads for the first time
    useEffect(() => {
        fetch('/api/getcountries').then(r => r.json()).then(data => {
            console.log(data);
            setCountries(data.countries);
        });
    }, []);


    return (
        <>
            <Head>
                <title>Budget Travel Recommender</title>
                <meta name="description"
                      content="Budget Travel Recommender is a web application that recommends travel destinations based on your budget. It also provides you with the weather forecast, currency exchange rate, and local dishes."/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main>
                <div className="landing-div">
                    <Image src={'/home.png'} className="home-img" alt="home" width={627} height={1080}/>
                    <div className="p-2 d-flex justify-content-center align-items-center w-75">
                        <Image src={'/icon.svg'} alt="icon" width={75} height={75}/>
                        <Nav>
                            <Nav.Item className="navbar-item">
                                <a className="navbar-link " href="#about">About</a>
                            </Nav.Item>
                            <Nav.Item className="navbar-item">
                                <a className="navbar-link" href="#search" onClick={() => {
                                    setActiveButton('left')
                                    setBudgetCountries(null)
                                    setDestination(null)
                                }}>Search By Location</a>
                            </Nav.Item>
                            <Nav.Item className="navbar-item">
                                <a className="navbar-link" href="#search" onClick={() => {
                                    setActiveButton('right')
                                    setBudgetCountries(null)
                                    setDestination(null)
                                }}>Search By Budget</a>
                            </Nav.Item>
                        </Nav>
                    </div>
                    <Image src={'/logo.svg'} className={'logo'} alt="logo" width={1024} height={325}/>
                    <button className='start-btn'
                            onClick={() => document.getElementById('search').scrollIntoView({behavior: 'smooth'})}>
                        Start
                    </button>

                </div>
                <div className="about-div" id="about">
                    <p className="about-title">Plan Your Trip The Way You Want</p>
                    <div className="about-card-group">
                        <div className="about-card">
                            <p className="about-card-title">Plan it all ahead</p>
                            <p className="about-card-text">Set a budget and date you would like to travel and choose
                                from places that best match your preferences.</p>
                        </div>
                        <div className="about-card">
                            <p className="about-card-title">Discover as you go</p>
                            <p className="about-card-text">Choose a destination and discover available options.</p>
                        </div>
                    </div>
                    <button className="about-btn"
                            onClick={() => document.getElementById('search').scrollIntoView({behavior: 'smooth'})}>
                        Let’s Go!
                    </button>
                </div>
                <div className={'search-div'} id="search">
                    <p className="search-title">PLAN YOUR TRIP THE WAY YOU WANT</p>
                    <div className="search-card-group">
                        {/*Show all the options*/}
                        <Nav variant="tabs" defaultActiveKey="right" className="search-nav" style={{border: 'none'}}>
                            <Nav.Item>
                                <Nav.Link
                                    eventKey="left"
                                    className={'ms-5'}
                                    style={customStyles[activeButton === 'left' ? 'search-nav-link-active' : 'search-nav-link']}
                                    onClick={() => {
                                        setActiveButton('left')
                                        setBudgetCountries(null)
                                        setDestination(null)
                                    }}
                                >
                                    Search By Location</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                    eventKey="right"
                                    style={customStyles[activeButton === 'right' ? 'search-nav-link-active' : 'search-nav-link']}
                                    onClick={() => {
                                        setActiveButton('right')
                                        setBudgetCountries(null)
                                        setDestination(null)
                                    }}
                                >
                                    Search By Budget</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Card style={{borderRadius: '0', border: 'none'}}>
                            {/*add a nav*/}
                            <div className="search-card">
                                <div className="search-card-body">
                                    {activeButton === 'right' ?
                                        <div className={'location-search'}>
                                            <h3 className={"fw-bold"}>Set budget</h3>
                                            <InputGroup className="mb-3 w-50 location-search-input">
                                                <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                                                <FormControl
                                                    placeholder="Enter your budget"
                                                    aria-label="Username"
                                                    aria-describedby="basic-addon1"
                                                    className="budget-input"
                                                    onChange={(e) => setBudget(e.target.value)}
                                                />
                                            </InputGroup>
                                            <button className="search-btn"
                                                    onClick={() => {
                                                        fetch(`/api/getbudget?budget=${budget}`)
                                                            .then(r => {
                                                                if (r.ok) {
                                                                    return r.json();
                                                                } else if (r.status === 400) {
                                                                    throw new Error('Invalid budget');
                                                                } else if (r.status === 404) {
                                                                    throw new Error('No results found');
                                                                }
                                                            })
                                                            .then(data => {
                                                                console.log(data.countries);
                                                                setBudgetCountries(data.countries);
                                                                // scroll to the search results
                                                                setTimeout(() => {
                                                                    if (document.querySelector('#search-results')) {
                                                                        document.querySelector('#search-results').scrollIntoView({behavior: 'smooth'});
                                                                    }
                                                                }, 500);

                                                            })
                                                            .catch(e => {
                                                                    console.log(e);
                                                                    setBudgetCountries(null);
                                                                    setDestination(null);
                                                                    alert(e);
                                                                }
                                                            )
                                                    }}
                                            >Search
                                            </button>
                                        </div>
                                        :
                                        <div className={'location-search'}>
                                            <h3 className={"fw-bold"}>Set location</h3>
                                            <FormSelect
                                                aria-label="Default select example"
                                                className="mb-3 w-50 location-search-input"
                                                defaultValue={''}
                                                onChange={(e) => setSelectedCountry(e.target.value)}
                                            >
                                                <option selected={true} disabled={true} value="">Select a country
                                                </option>
                                                {countries.map((country, index) => (
                                                    <option key={index} value={country}>{country}</option>
                                                ))}
                                            </FormSelect>
                                            <button className="search-btn"
                                                    onClick={() => {
                                                        fetch(`/api/getdestination?country=${selectedCountry}`)
                                                            .then(r => r.json())
                                                            .then(data => {
                                                                console.log(data.country);
                                                                setDestination(data.country);

                                                                setTimeout(() => {
                                                                    if (document.querySelector('.result-card')) {
                                                                        document.querySelector('.result-card').scrollIntoView({behavior: 'smooth'});
                                                                    }
                                                                }, 500);
                                                            });

                                                    }}>Search
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>

                        </Card>
                    </div>
                </div>
                {budgetCountries &&
                    <div className="search-results" id="search-results">
                        <p className="search-results-title">Best Matches</p>
                        <div className="search-results-card-group">
                            {budgetCountries.map((country) => (
                                <div className="search-result" key={country.name} onClick={
                                    () => {
                                        fetch(`/api/getdestination?country=${country.name}`)
                                            .then(r => r.json())
                                            .then(data => {
                                                console.log(data.country);
                                                setDestination(data.country);
                                                // scroll to the search results
                                                // wait for the result card to be rendered

                                                setTimeout(() => {
                                                    if (document.querySelector('.result-card')) {
                                                        document.querySelector('.result-card').scrollIntoView({behavior: 'smooth'});
                                                    }
                                                }, 500);
                                            });
                                    }
                                }>

                                    <img src={country.flag} alt="flag" className="result-card-flag"
                                         width={300} height={157.5}/>
                                    <div className="result-card-name"> {country.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                {destination &&
                    <div className="result-card">
                        <div className="result-card-body">
                            <div className="result-card-title">
                                <div className="result-card-title-container">
                                    <p className="result-card-title-text">{destination.name}</p>
                                    <p className="result-card-title-subtext">{destination.capital}</p>
                                </div>
                                <img src={destination.flag} alt="flag" className="result-card-flag"
                                     width={150} height={78.75}/>
                            </div>
                            <div className="result-card-weather-container">
                                {destination.weather.map((day) => (
                                    <div className="result-card-weather" key={day.date}>
                                        <img src={`http://openweathermap.org/img/w/${day.icon}.png`}
                                             alt="weather-icon" width={50} height={50}/>
                                        <p className="result-card-weather-text">{day.date}</p>
                                        <p className="result-card-weather-text">{day.min} / {day.max} °C</p>
                                    </div>
                                ))}
                            </div>
                            <div className="result-card-stats-container">
                                <div className="result-card-stat">
                                    <svg width="40" height="40" viewBox="0 0 15 25" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.41539 14.68V20.344C10.0474 20.248 11.0714 19.032 11.0714 17.656C11.0714 16.184 10.0474 15.096 8.41539 14.68ZM7.10338 10.2V5.112C5.53539 5.208 4.57539 6.264 4.57539 7.512C4.57539 8.792 5.47139 9.976 7.10338 10.2ZM8.41539 24.76H7.10338V23.512C2.36738 23.096 0.383385 21.176 0.383385 16.632H4.22338C4.57539 19.384 5.24739 20.088 7.10338 20.344V14.168C2.87938 13.048 0.767385 11.512 0.767385 8.056C0.767385 4.728 3.45538 2.008 7.10338 1.944V0.535999H8.41539V1.944C12.3194 2.072 14.4314 4.184 14.6234 8.152H10.8474C10.6554 5.848 9.85538 5.208 8.41539 5.112V10.616C14.1434 12.504 14.9754 14.008 14.9754 17.144C14.9754 20.856 12.3834 23.32 8.41539 23.512V24.76Z"
                                            fill="black"/>
                                    </svg>
                                    <p className="result-card-stat-text">{destination.currency} ({destination.currencyRate} EGP)</p>
                                </div>
                                <div className="result-card-stat">
                                    <svg width="40" height="40" viewBox="0 0 41 39" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_39_123)">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                  d="M35.6914 2.4375H5.67937C5.01607 2.4375 4.37993 2.69431 3.9109 3.15143C3.44187 3.60855 3.17837 4.22854 3.17837 4.875V33.1159L8.18037 28.2409C9.11821 27.3266 10.3903 26.8128 11.7168 26.8125H35.6914C36.3547 26.8125 36.9908 26.5557 37.4599 26.0986C37.9289 25.6415 38.1924 25.0215 38.1924 24.375V4.875C38.1924 4.22854 37.9289 3.60855 37.4599 3.15143C36.9908 2.69431 36.3547 2.4375 35.6914 2.4375ZM5.67937 0C4.35276 0 3.08048 0.513615 2.14242 1.42785C1.20436 2.34209 0.677368 3.58207 0.677368 4.875L0.677368 36.0579C0.677421 36.2991 0.750879 36.5348 0.888446 36.7353C1.02601 36.9357 1.2215 37.0919 1.45018 37.184C1.67885 37.2761 1.93042 37.3001 2.17306 37.2528C2.41569 37.2055 2.63848 37.0891 2.81322 36.9184L9.94858 29.9642C10.4175 29.507 11.0535 29.2501 11.7168 29.25H35.6914C37.018 29.25 38.2903 28.7364 39.2283 27.8221C40.1664 26.9079 40.6934 25.6679 40.6934 24.375V4.875C40.6934 3.58207 40.1664 2.34209 39.2283 1.42785C38.2903 0.513615 37.018 0 35.6914 0L5.67937 0Z"
                                                  fill="black"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                  d="M8.18036 8.53125C8.18036 8.20802 8.31211 7.89802 8.54662 7.66946C8.78114 7.4409 9.09921 7.3125 9.43086 7.3125H31.9399C32.2715 7.3125 32.5896 7.4409 32.8241 7.66946C33.0586 7.89802 33.1904 8.20802 33.1904 8.53125C33.1904 8.85448 33.0586 9.16448 32.8241 9.39304C32.5896 9.6216 32.2715 9.75 31.9399 9.75H9.43086C9.09921 9.75 8.78114 9.6216 8.54662 9.39304C8.31211 9.16448 8.18036 8.85448 8.18036 8.53125ZM8.18036 14.625C8.18036 14.3018 8.31211 13.9918 8.54662 13.7632C8.78114 13.5347 9.09921 13.4062 9.43086 13.4062H31.9399C32.2715 13.4062 32.5896 13.5347 32.8241 13.7632C33.0586 13.9918 33.1904 14.3018 33.1904 14.625C33.1904 14.9482 33.0586 15.2582 32.8241 15.4868C32.5896 15.7153 32.2715 15.8438 31.9399 15.8438H9.43086C9.09921 15.8438 8.78114 15.7153 8.54662 15.4868C8.31211 15.2582 8.18036 14.9482 8.18036 14.625ZM8.18036 20.7188C8.18036 20.3955 8.31211 20.0855 8.54662 19.857C8.78114 19.6284 9.09921 19.5 9.43086 19.5H21.9359C22.2675 19.5 22.5856 19.6284 22.8201 19.857C23.0546 20.0855 23.1864 20.3955 23.1864 20.7188C23.1864 21.042 23.0546 21.352 22.8201 21.5805C22.5856 21.8091 22.2675 21.9375 21.9359 21.9375H9.43086C9.09921 21.9375 8.78114 21.8091 8.54662 21.5805C8.31211 21.352 8.18036 21.042 8.18036 20.7188Z"
                                                  fill="black"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_39_123">
                                                <rect width="40.016" height="39" fill="white"
                                                      transform="translate(0.677368)"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <p className="result-card-stat-text">{destination.language}</p>
                                </div>
                                <div className="result-card-stat">
                                    <svg width="40" height="40" viewBox="0 0 41 39" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_40_17)">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                  d="M37.5997 0.182526C37.7808 0.291712 37.9303 0.444181 38.0341 0.625476C38.1378 0.806772 38.1923 1.01088 38.1924 1.21846V37.781C38.1924 38.1042 38.0606 38.4142 37.8261 38.6427C37.5916 38.8713 37.2736 38.9997 36.9419 38.9997H29.4389C29.1072 38.9997 28.7892 38.8713 28.5547 38.6427C28.3201 38.4142 28.1884 38.1042 28.1884 37.781V34.1247H25.6874V37.781C25.6874 38.1042 25.5556 38.4142 25.3211 38.6427C25.0866 38.8713 24.7685 38.9997 24.4369 38.9997H1.92787C1.59622 38.9997 1.27815 38.8713 1.04363 38.6427C0.809117 38.4142 0.677368 38.1042 0.677368 37.781V24.3747C0.677567 24.119 0.760272 23.8699 0.913775 23.6625C1.06728 23.4552 1.28381 23.3001 1.53271 23.2193L15.6834 18.6222V10.9685C15.6834 10.7423 15.748 10.5206 15.8699 10.3282C15.9918 10.1358 16.1662 9.98021 16.3737 9.8789L36.3817 0.128901C36.5725 0.0358027 36.7846 -0.00814468 36.9978 0.00124186C37.211 0.0106284 37.4182 0.0730364 37.5997 0.182526ZM15.6834 21.1913L3.17837 25.2522V36.5622H15.6834V21.1913ZM18.1844 36.5622H23.1864V32.906C23.1864 32.5827 23.3181 32.2727 23.5526 32.0442C23.7872 31.8156 24.1052 31.6872 24.4369 31.6872H29.4389C29.7705 31.6872 30.0886 31.8156 30.3231 32.0442C30.5576 32.2727 30.6894 32.5827 30.6894 32.906V36.5622H35.6914V3.1904L18.1844 11.7217V36.5622Z"
                                                  fill="black"/>
                                            <path
                                                d="M5.67938 26.8125H8.18038V29.25H5.67938V26.8125ZM10.6814 26.8125H13.1824V29.25H10.6814V26.8125ZM5.67938 31.6875H8.18038V34.125H5.67938V31.6875ZM10.6814 31.6875H13.1824V34.125H10.6814V31.6875ZM20.6854 21.9375H23.1864V24.375H20.6854V21.9375ZM25.6874 21.9375H28.1884V24.375H25.6874V21.9375ZM20.6854 26.8125H23.1864V29.25H20.6854V26.8125ZM25.6874 26.8125H28.1884V29.25H25.6874V26.8125ZM30.6894 21.9375H33.1904V24.375H30.6894V21.9375ZM30.6894 26.8125H33.1904V29.25H30.6894V26.8125ZM20.6854 17.0625H23.1864V19.5H20.6854V17.0625ZM25.6874 17.0625H28.1884V19.5H25.6874V17.0625ZM30.6894 17.0625H33.1904V19.5H30.6894V17.0625ZM20.6854 12.1875H23.1864V14.625H20.6854V12.1875ZM25.6874 12.1875H28.1884V14.625H25.6874V12.1875ZM30.6894 12.1875H33.1904V14.625H30.6894V12.1875ZM30.6894 7.3125H33.1904V9.75H30.6894V7.3125Z"
                                                fill="black"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_40_17">
                                                <rect width="40.016" height="39" fill="white"
                                                      transform="translate(0.677368)"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <p className="result-card-stat-text">$ {destination.hotelAveragePrice}/night</p>
                                </div>
                                <div className="result-card-stat">
                                    <svg width="40" height="40" viewBox="0 0 41 39" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_41_31)">
                                            <mask id="path-1-inside-1_41_31" fill="white">
                                                <path
                                                    d="M5.19118 23.6142C5.28943 23.6826 5.40554 23.7179 5.52345 23.7179C5.58597 23.7179 5.6485 23.7079 5.70872 23.6878L18.2081 19.5077L18.3107 21.6649C18.3469 23.2496 18.4294 25.1879 18.6049 27.075L13.0667 30.7168C12.9093 30.8205 12.8148 30.9933 12.8148 31.1786V33.6308C12.8148 33.8022 12.8957 33.9641 13.0343 34.0696C13.1359 34.1472 13.2604 34.188 13.3865 34.188C13.4322 34.188 13.4786 34.1825 13.5238 34.1716L19.6349 32.6956C20.0425 33.8253 20.5707 34.5429 21.2575 34.5429C21.9453 34.5429 22.4741 33.8279 22.8819 32.7016L28.9917 34.1716C29.0369 34.1825 29.0828 34.188 29.1285 34.188C29.2554 34.188 29.3791 34.1469 29.4807 34.0693C29.619 33.9639 29.7002 33.8022 29.7002 33.6308V31.1786C29.7002 30.9933 29.6058 30.8205 29.4478 30.7168L23.9132 27.0799C24.0882 25.1946 24.1691 23.259 24.2041 21.6789L24.3072 19.5077L36.8059 23.6878C36.8661 23.7079 36.9287 23.7179 36.9912 23.7179C37.1091 23.7179 37.2252 23.6826 37.3235 23.6142C37.4735 23.5094 37.5629 23.3406 37.5629 23.1607V19.8778C37.5629 19.6733 37.4478 19.4853 37.263 19.3878L35.361 18.3822V16.7478C35.361 15.9559 34.7 15.3114 33.8871 15.3114C33.0794 15.3114 32.4217 15.9559 32.4217 16.7478V16.8282L30.4031 15.7609V14.1907C30.4031 13.3987 29.7421 12.7543 28.9293 12.7543C28.1216 12.7543 27.4639 13.3987 27.4639 14.1907V14.2069L24.623 12.7048C24.7393 9.84599 24.8332 7.42787 24.8332 6.44717C24.8335 3.40676 23.2962 1.11426 21.2573 1.11426C19.2185 1.11426 17.6812 3.40676 17.6812 6.44691C17.6812 7.42761 17.7751 9.84472 17.8915 12.7048L15.0508 14.2069V14.1907C15.0508 13.3987 14.3932 12.7543 13.5849 12.7543C12.7726 12.7543 12.1116 13.3987 12.1116 14.1907V15.7609L10.093 16.8282V16.7478C10.093 15.9559 9.43533 15.3114 8.62756 15.3114C7.81476 15.3114 7.15373 15.9559 7.15373 16.7478V18.3822L5.25171 19.3878C5.06694 19.4853 4.95184 19.6731 4.95184 19.8778V23.1607C4.95184 23.3403 5.04111 23.5094 5.19118 23.6142ZM33.565 16.7476C33.565 16.57 33.7097 16.4255 33.8871 16.4255C34.0723 16.4255 34.2176 16.567 34.2176 16.7476V17.7773L33.565 17.4324V16.7476ZM28.6071 14.1902C28.6071 14.0126 28.7518 13.8681 28.9292 13.8681C29.1145 13.8681 29.2597 14.0097 29.2597 14.1902V15.1558L28.6071 14.8108V14.1902ZM24.4368 16.7675C24.4506 16.4723 24.4649 16.1704 24.4792 15.8641C24.5085 15.2344 24.5384 14.5932 24.5685 13.943L27.9183 15.7141L29.5583 16.5834C29.5629 16.5859 29.5677 16.5864 29.5723 16.5886L32.7818 18.2856L34.5161 19.205C34.521 19.2075 34.5261 19.2082 34.5309 19.2107L36.4192 20.2091V22.38L24.3634 18.3484L24.4368 16.7675ZM28.5564 31.4748V32.9195L23.2053 31.632C23.4502 30.6665 23.6381 29.5321 23.7807 28.3364L28.5564 31.4748ZM21.2568 2.22834C22.6211 2.22834 23.6896 4.08136 23.6896 6.44671C23.6896 7.44683 23.5886 10.0094 23.4663 13.0044C23.4099 14.26 23.3497 15.5402 23.2948 16.7174L23.0603 21.6401C22.9676 25.8104 22.5274 29.7438 21.9964 31.8489C21.9884 31.8695 21.9734 31.8859 21.9678 31.9078C21.9629 31.9267 21.968 31.9451 21.9652 31.964C21.7427 32.8112 21.5056 33.3454 21.2716 33.4305C21.0279 33.3427 20.7831 32.7985 20.5547 31.9359C20.5524 31.9234 20.5562 31.9115 20.5532 31.8991C20.5493 31.8844 20.5389 31.8739 20.534 31.8598C20.249 30.7537 19.9922 29.1392 19.798 27.2472C19.7962 27.2362 19.797 27.2258 19.7947 27.2149C19.6211 25.5151 19.4976 23.5987 19.4524 21.625L19.2184 16.717C19.1638 15.5398 19.1033 14.2595 19.0469 13.004C19.0469 13.0038 19.0467 13.0035 19.0467 13.0033C18.9244 10.0071 18.8236 7.44605 18.8236 6.44618C18.8239 4.08103 19.8924 2.22807 21.2567 2.22807L21.2568 2.22834ZM19.3116 31.6251L13.9577 32.9183V31.4744L18.7369 28.3315C18.8796 29.5267 19.0671 30.6601 19.3116 31.6252L19.3116 31.6251ZM13.2541 14.19C13.2541 14.0095 13.3993 13.8679 13.5841 13.8679C13.7622 13.8679 13.9067 14.0124 13.9067 14.19V14.8106L13.2541 15.1556V14.19ZM8.29622 16.7474C8.29622 16.5698 8.44475 16.4253 8.62671 16.4253C8.80434 16.4253 8.94878 16.5698 8.94878 16.7474V17.4322L8.29622 17.7771V16.7474ZM6.09459 20.2089L7.98283 19.2105C7.98767 19.208 7.99303 19.2073 7.99763 19.2048L9.732 18.2855L12.9415 16.5884C12.946 16.5862 12.9509 16.5855 12.9555 16.5832L14.5955 15.7139L17.9452 13.9428C17.9751 14.5895 18.005 15.227 18.0341 15.8533C18.0486 16.1632 18.0629 16.4686 18.0769 16.7673L18.1502 18.3482L6.0944 22.38L6.09459 20.2089Z"/>
                                            </mask>
                                            <path
                                                d="M5.19118 23.6142C5.28943 23.6826 5.40554 23.7179 5.52345 23.7179C5.58597 23.7179 5.6485 23.7079 5.70872 23.6878L18.2081 19.5077L18.3107 21.6649C18.3469 23.2496 18.4294 25.1879 18.6049 27.075L13.0667 30.7168C12.9093 30.8205 12.8148 30.9933 12.8148 31.1786V33.6308C12.8148 33.8022 12.8957 33.9641 13.0343 34.0696C13.1359 34.1472 13.2604 34.188 13.3865 34.188C13.4322 34.188 13.4786 34.1825 13.5238 34.1716L19.6349 32.6956C20.0425 33.8253 20.5707 34.5429 21.2575 34.5429C21.9453 34.5429 22.4741 33.8279 22.8819 32.7016L28.9917 34.1716C29.0369 34.1825 29.0828 34.188 29.1285 34.188C29.2554 34.188 29.3791 34.1469 29.4807 34.0693C29.619 33.9639 29.7002 33.8022 29.7002 33.6308V31.1786C29.7002 30.9933 29.6058 30.8205 29.4478 30.7168L23.9132 27.0799C24.0882 25.1946 24.1691 23.259 24.2041 21.6789L24.3072 19.5077L36.8059 23.6878C36.8661 23.7079 36.9287 23.7179 36.9912 23.7179C37.1091 23.7179 37.2252 23.6826 37.3235 23.6142C37.4735 23.5094 37.5629 23.3406 37.5629 23.1607V19.8778C37.5629 19.6733 37.4478 19.4853 37.263 19.3878L35.361 18.3822V16.7478C35.361 15.9559 34.7 15.3114 33.8871 15.3114C33.0794 15.3114 32.4217 15.9559 32.4217 16.7478V16.8282L30.4031 15.7609V14.1907C30.4031 13.3987 29.7421 12.7543 28.9293 12.7543C28.1216 12.7543 27.4639 13.3987 27.4639 14.1907V14.2069L24.623 12.7048C24.7393 9.84599 24.8332 7.42787 24.8332 6.44717C24.8335 3.40676 23.2962 1.11426 21.2573 1.11426C19.2185 1.11426 17.6812 3.40676 17.6812 6.44691C17.6812 7.42761 17.7751 9.84472 17.8915 12.7048L15.0508 14.2069V14.1907C15.0508 13.3987 14.3932 12.7543 13.5849 12.7543C12.7726 12.7543 12.1116 13.3987 12.1116 14.1907V15.7609L10.093 16.8282V16.7478C10.093 15.9559 9.43533 15.3114 8.62756 15.3114C7.81476 15.3114 7.15373 15.9559 7.15373 16.7478V18.3822L5.25171 19.3878C5.06694 19.4853 4.95184 19.6731 4.95184 19.8778V23.1607C4.95184 23.3403 5.04111 23.5094 5.19118 23.6142ZM33.565 16.7476C33.565 16.57 33.7097 16.4255 33.8871 16.4255C34.0723 16.4255 34.2176 16.567 34.2176 16.7476V17.7773L33.565 17.4324V16.7476ZM28.6071 14.1902C28.6071 14.0126 28.7518 13.8681 28.9292 13.8681C29.1145 13.8681 29.2597 14.0097 29.2597 14.1902V15.1558L28.6071 14.8108V14.1902ZM24.4368 16.7675C24.4506 16.4723 24.4649 16.1704 24.4792 15.8641C24.5085 15.2344 24.5384 14.5932 24.5685 13.943L27.9183 15.7141L29.5583 16.5834C29.5629 16.5859 29.5677 16.5864 29.5723 16.5886L32.7818 18.2856L34.5161 19.205C34.521 19.2075 34.5261 19.2082 34.5309 19.2107L36.4192 20.2091V22.38L24.3634 18.3484L24.4368 16.7675ZM28.5564 31.4748V32.9195L23.2053 31.632C23.4502 30.6665 23.6381 29.5321 23.7807 28.3364L28.5564 31.4748ZM21.2568 2.22834C22.6211 2.22834 23.6896 4.08136 23.6896 6.44671C23.6896 7.44683 23.5886 10.0094 23.4663 13.0044C23.4099 14.26 23.3497 15.5402 23.2948 16.7174L23.0603 21.6401C22.9676 25.8104 22.5274 29.7438 21.9964 31.8489C21.9884 31.8695 21.9734 31.8859 21.9678 31.9078C21.9629 31.9267 21.968 31.9451 21.9652 31.964C21.7427 32.8112 21.5056 33.3454 21.2716 33.4305C21.0279 33.3427 20.7831 32.7985 20.5547 31.9359C20.5524 31.9234 20.5562 31.9115 20.5532 31.8991C20.5493 31.8844 20.5389 31.8739 20.534 31.8598C20.249 30.7537 19.9922 29.1392 19.798 27.2472C19.7962 27.2362 19.797 27.2258 19.7947 27.2149C19.6211 25.5151 19.4976 23.5987 19.4524 21.625L19.2184 16.717C19.1638 15.5398 19.1033 14.2595 19.0469 13.004C19.0469 13.0038 19.0467 13.0035 19.0467 13.0033C18.9244 10.0071 18.8236 7.44605 18.8236 6.44618C18.8239 4.08103 19.8924 2.22807 21.2567 2.22807L21.2568 2.22834ZM19.3116 31.6251L13.9577 32.9183V31.4744L18.7369 28.3315C18.8796 29.5267 19.0671 30.6601 19.3116 31.6252L19.3116 31.6251ZM13.2541 14.19C13.2541 14.0095 13.3993 13.8679 13.5841 13.8679C13.7622 13.8679 13.9067 14.0124 13.9067 14.19V14.8106L13.2541 15.1556V14.19ZM8.29622 16.7474C8.29622 16.5698 8.44475 16.4253 8.62671 16.4253C8.80434 16.4253 8.94878 16.5698 8.94878 16.7474V17.4322L8.29622 17.7771V16.7474ZM6.09459 20.2089L7.98283 19.2105C7.98767 19.208 7.99303 19.2073 7.99763 19.2048L9.732 18.2855L12.9415 16.5884C12.946 16.5862 12.9509 16.5855 12.9555 16.5832L14.5955 15.7139L17.9452 13.9428C17.9751 14.5895 18.005 15.227 18.0341 15.8533C18.0486 16.1632 18.0629 16.4686 18.0769 16.7673L18.1502 18.3482L6.0944 22.38L6.09459 20.2089Z"
                                                fill="black" stroke="black" stroke-width="224"
                                                mask="url(#path-1-inside-1_41_31)"/>
                                            <path
                                                d="M19.8883 6.36661C20.2042 6.36661 20.46 6.11714 20.46 5.80947C20.46 5.36674 20.8295 5.00686 21.2835 5.00686C21.7372 5.00686 22.107 5.36677 22.107 5.80947C22.107 6.11714 22.3627 6.36661 22.6787 6.36661C22.9946 6.36661 23.2503 6.11714 23.2503 5.80947C23.2503 5.28349 23.0319 4.80626 22.6787 4.45954C22.3222 4.10958 21.8284 3.89258 21.2835 3.89258C20.7386 3.89258 20.2448 4.10957 19.8883 4.45954C19.5351 4.80623 19.3167 5.28343 19.3167 5.80947C19.3167 6.11714 19.5724 6.36661 19.8883 6.36661Z"
                                                fill="black" stroke="black" stroke-width="112"/>
                                            <path
                                                d="M21.257 25.3423C20.9411 25.3423 20.6854 25.5918 20.6854 25.8994V30.2434C20.6854 30.5511 20.9411 30.8006 21.257 30.8006C21.573 30.8006 21.8287 30.5511 21.8287 30.2434V25.8994C21.8287 25.5918 21.573 25.3423 21.257 25.3423Z"
                                                fill="black" stroke="black" stroke-width="112"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_41_31">
                                                <rect width="40.016" height="39" fill="white"
                                                      transform="translate(0.677368)"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <p className="result-card-stat-text">$ {destination.flightAveragePrice}/seat</p>
                                </div>
                                <p className="result-card-description">
                                    {destination.description}
                                </p>
                            </div>
                        </div>
                        <div className="result-card-data">
                            {/*<div className="result-card-attractions">*/}
                            {/*</div>*/}
                            <div className="result-card-meals">
                                {destination.meals.map((meal) => (
                                    <div
                                        className="result-card-meal"
                                        key={meal.idMeal}
                                        onClick={() => {
                                            window.open(
                                                `https://www.themealdb.com/meal.php?c=${meal.idMeal}`,
                                                '_blank'
                                            )
                                        }}
                                        // onMouseEnter={(e) => e.currentTarget.classList.add('shadow')}
                                        // onMouseLeave={(e) => e.currentTarget.classList.remove('shadow')}
                                    >
                                        <img className="result-card-meal-img" src={meal.strMealThumb}
                                             alt={meal.strMeal} height={300} width={300}/>
                                        <p className="result-card-meal-name">{meal.strMeal}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                }
            </main>
        </>
    )
}
