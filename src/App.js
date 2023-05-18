import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { baseAPIURL } from './util/http';

function App() {

  const [musicFestivals, setMusicFestivals] = useState([]);
  const [recordLabels, setRecordLabels] = useState([]);
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

      // Take all the recordLabels out and store in recordLabels
      data.map((musicFestival, index) => {
        musicFestival.bands.map((band, index) => {
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
      // setRecordLabels(recordLabelsTmp);
      console.log("recordLabelsTmp is::", recordLabelsTmp.toString());

      // Loop the recordLabelsTmp and push the bands name to recordLabels, and festivals name to bands
      let formattedResults = [];
      let recordLabelObj = {};
      let bandsTmp = [];
      let bandObj = {};
      let FestivalsTmp = [];
      let bandNameTmp = "";
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
            console.log('bandObj[key] is::', bandObj[key]);
            obj[key] = bandObj[key].sort();
            return obj;
          }, {}
        );

        console.log('bandObj is::', JSON.stringify(Object.entries(sortedBandObj)));
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
      console.log("formattedResults is::", JSON.stringify(formattedResults));
    }

    // let testObj = {};
    // let testArr = [];
    // testArr.push('a');
    // testArr.push('b');
    // testArr.push('c');
    // testObj['name'] = testArr;
    // console.log('testObj is::', JSON.stringify(testObj));
  }


  // [
  //   {
  //     "recordLabel": "recordLabel 1",
  //       "bands":{
  //         "band 1": [festival1, fes2],      
  //         "band 2": [festival1, fes2]
  //       }     
  //   },
  //   {
  //     "recordLabel 2": 
  //       {
  //         "band x": [festival1, fes2],       
  //         "band y": [festival1, fes2]
  //       }
  //   }
  // ]

  useEffect(() => {
    getFestivals();
  }, []);


  return (
    <div className="App">
      <h1 style={{ color: "green" }}>Music Festivals</h1>
      <center>
        {formattedResults.length !== 0 ? formattedResults.map((recordLabel, index) => {
          return (
            <div
              style={{
                width: '100%',
                backgroundColor: "#35D841",
                padding: 2,
                borderRadius: 10,
                marginBlock: 10,
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: '100%',
                  backgroundColor: "grey",
                  padding: 2,
                  borderRadius: 1,
                  marginBlock: 4,
                  textAlign: 'left',
                }}
              >
                <p style={{ fontSize: 25, color: 'white' }}>{recordLabel.recordLabel}</p>
              </div>
              {recordLabel.bands.map((band, index) => {
                return (
                  <div
                    style={{
                      width: '100%',
                      backgroundColor: "lightgrey",
                      padding: 2,
                      borderRadius: 1,
                      marginBlock: 2,
                    }}
                  >
                    <p style={{ fontSize: 20, color: 'blue' }}>&emsp;{band[0]}</p>
                    {band[1].map((festival, index) => {
                      return (
                        <div
                          style={{
                            width: '100%',
                            backgroundColor: "white",
                            padding: 2,
                            borderRadius: 1,
                            marginBlock: 2,
                          }}
                        >
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
