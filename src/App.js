import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { baseAPIURL, getFestivals } from './util/http';

function App() {

  const [musicFestivals, setMusicFestivals] = useState([]);
  const [recordLabels, setRecordLabels] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const getFestivals = async () => {
    try {
      // const response = axios.get('https://eacp.energyaustralia.com.au/codingtest/api/v1/festivals');
      const res = await axios.get('http://localhost:5000/codingtest/api/v1/festivals')
        .then((response) => response.data)
        .then((data) => {
          setMusicFestivals(data);
          return data
        }
        )
      console.log('res data is::', res);
    } catch (err) {
      if (err.response && err.response.status === 429) {
        console.log('Too Many Requests!');
        setErrorMessage('Too Many Requests!');
      } else {
        setErrorMessage(err.message);
        console.log(err.message);
      }
    }
  }



  useEffect(() => {
    getFestivals();
  }, []);


  return (
    <div className="App">
      <h1 style={{ color: "green" }}>Music Festivals</h1>
      <center>
        {musicFestivals.length !== 0 ? musicFestivals.map((musicFestival, index) => {
          return (
            <div
              style={{
                width: "15em",
                backgroundColor: "#35D841",
                padding: 2,
                borderRadius: 10,
                marginBlock: 10,
              }}
            >
              <p style={{ fontSize: 20, color: 'white' }}>{musicFestival.name}</p>
              <p style={{ fontSize: 20, color: 'green' }}>
                {musicFestival.bands.map((band, index) => {
                  return (
                    <div
                      style={{
                        width: "15em",
                        backgroundColor: "#35D841",
                        padding: 2,
                        borderRadius: 10,
                        marginBlock: 10,
                      }}
                    >
                      <p style={{ fontSize: 20, color: 'yellow' }}>{band.recordLabel}</p>
                      <p style={{ fontSize: 20, color: 'blue' }}>{band.name}</p>
                    </div>
                  )

                })}
              </p>
            </div>
          )
        })
          :
          <p style={{ fontSize: 20, color: 'red' }}>{errorMessage}</p>
        }
      </center>
    </div>
  );
}

export default App;
