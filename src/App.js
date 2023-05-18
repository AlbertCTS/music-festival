import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { baseAPIURL } from './util/http';
import './styles/styles.css';

function App() {

  const [formattedResults, setFormattedResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const getFestivals = async () => {
    try {
      const res = await axios.get(baseAPIURL)
        .then((response) => response.data)
        .then((data) => {
          // setMusicFestivals(data);
          formatMusicFestivals(data);
          return data
        }
        )
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
    let recordLabelsMap = {};
    let recordLabelsTmp = []
    if (data.length > 0) {

      // Take all the recordLabels out and store in recordLabels
      data.map((musicFestival, index) => {
        musicFestival.bands.map((band, index) => {
          //  Treated recordLabel ==="", undefined, null as same as ""
          if (band.recordLabel === "" || band.recordLabel === undefined || band.recordLabel === null) {
            recordLabelsMap[""] = recordLabelsMap[""] === undefined ? 1 : recordLabelsMap[""] + 1;
            if (recordLabelsMap[""] === 1) {
              recordLabelsTmp.push("")
            }
          } else {
            recordLabelsMap[band.recordLabel] = recordLabelsMap[band.recordLabel] === undefined
              ? 1
              : recordLabelsMap[band.recordLabel] + 1

            if (recordLabelsMap[band.recordLabel] === 1) {
              recordLabelsTmp.push(band.recordLabel)
            }
          }
          recordLabelsTmp.sort();
        })
      })

      // Loop the recordLabelsTmp and push the bands name to recordLabels, and festivals name to bands
      let formattedResults = [];
      let recordLabelObj = {};
      let bandObj = {};
      recordLabelsTmp.map((recordLabel, index) => {
        data.map((musicFestival, index) => {
          musicFestival.bands.map((band, index) => {
            if (band.recordLabel === recordLabel
              || ((band.recordLabel === undefined || band.recordLabel === null || band.recordLabel === "") && recordLabel === "")
            ) {
              // set the bandObj[band.name] to array to accept push values;
              if (bandObj[band.name] === undefined) {
                bandObj[band.name] = [];
              }
              bandObj[band.name].push(musicFestival.name)
            }
          })
        })

        // Sort the bandObj by keys
        let sortedBandObj = Object.keys(bandObj).sort().reduce(
          (obj, key) => {
            obj[key] = bandObj[key].sort();
            return obj;
          }, {}
        );

        if (recordLabelObj[recordLabel] === undefined) {
          recordLabelObj["recordLabel"] = recordLabel;
          recordLabelObj["bands"] = Object.entries(sortedBandObj);
          bandObj = {};
          sortedBandObj = {}
          formattedResults.push(recordLabelObj);
          recordLabelObj = {};
        }
      })


      setFormattedResults(formattedResults);
    }

  }

  useEffect(() => {
    getFestivals();
  }, []);


  return (
    <div className="App">
      <h1 style={{ color: "green" }}>Music Festivals</h1>
      <center>
        {formattedResults.length !== 0 ? formattedResults.map((recordLabel, index) => {
          return (
            <div className='ListContainer'>
              <div className='RecordLabel'>
                <p style={{ fontSize: 25, color: 'white' }}>{recordLabel.recordLabel}</p>
              </div>
              {recordLabel.bands.map((band, index) => {
                return (
                  <div className='BandName'>
                    <p style={{ fontSize: 20, color: 'blue' }}>&emsp;{band[0]}</p>
                    {band[1].map((festival, index) => {
                      return (
                        <div className='Festival'>
                          <p style={{ fontSize: 15, color: 'black' }}>&emsp;&emsp;&emsp;{festival}</p>
                        </div>
                      )
                    })}
                  </div>
                )

              })}
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
