import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { baseAPIURL } from './util/http';

function App() {

  const [musicFestivals, setMusicFestivals] = useState([]);
  const [recordLabels, setRecordLabels] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const getFestivals = async () => {
    try {
      const res = await axios.get(baseAPIURL)
        .then((response) => response.data)
        .then((data) => {
          setMusicFestivals(data);
          formatMusicFestivals(data);
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

  const formatMusicFestivals = (data) => {
    console.log('data inside formatMusicFestivals is::', data);
    let recordLabelsMap = {};
    let recordLabelsTmp = []
    if (data.length > 0) {
      data.map((musicFestival, index) => {
        musicFestival.bands.map((band, index) => {
          recordLabelsMap[band.recordLabel] = recordLabelsMap[band.recordLabel] === undefined
            ? 1
            : recordLabelsMap[band.recordLabel] + 1
          if (recordLabelsMap[band.recordLabel] === 1) {
            recordLabelsTmp.push(band.recordLabel)
          }
          recordLabelsTmp.sort((a, b) => a > b ? 1 : b > a ? -1 : 0);
        })
      })

    }
    setRecordLabels(recordLabelsTmp);
    console.log("recordLabelsTmp is::", recordLabelsTmp.toString());
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
