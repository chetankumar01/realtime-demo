import React, { Component } from 'react';
import * as firebase from 'firebase';
import moment from 'moment'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'

var config = {
  apiKey: "AIzaSyDyXey5aVWKehiBc9aJlNHxsYHUaGihCKQ",
  authDomain: "realtime-demo-ddb8f.firebaseapp.com",
  databaseURL: "https://hacker-news.firebaseio.com",
  storageBucket: "realtime-demo-ddb8f.appspot.com",
  messagingSenderId: "323790635229"
};
firebase.initializeApp(config);

class App extends Component {
  constructor() {
    super();
    this.state = {
      hnData: [],
      startedAt: null,
    }
  }

  componentWillMount(){
    firebase.database().ref().child('v0').child('maxitem').on('value', (snapshot) => {
      if(!this.state.startedAt){
        const hnData = [...this.state.hnData,
                        {time: moment().format('h:mm:ss a'), "HN-Count": 1}];
        this.setState({hnData, startedAt: snapshot.val()});
      }
      else{
        const hnData = [...this.state.hnData,
                        {time: moment().format('h:mm:ss a'),
                         "HN-Count": snapshot.val() - this.state.startedAt}];
        this.setState({hnData});
      }
    })
  }

  render() {
    console.log(this.state.hnData);
    return (
      <div>
        <h1 className="title is-h1">Near-Realtime HN Tracker</h1>
        {this.state.hnData.length &&
         <LineChart width={600} height={300} data={this.state.hnData}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}}>
           <XAxis dataKey="time"/>
           <YAxis/>
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip/>
           <Legend />
           <Line type="monotone" dataKey="HN-Count" stroke="#8884d8" activeDot={{r: 8}}/>
         </LineChart>
        }
         {this.state.startedAt &&
         <h4 className="title is-h4">Started Counting at - {this.state.startedAt}</h4>}
      </div>
    );
  }
}

export default App;
