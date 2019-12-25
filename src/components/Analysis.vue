<!-- This file contains the structure to display all the open cases -->
<template slot="items" slot-scope="props" >
    <v-container > 
            <template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" divider=">"></v-breadcrumbs>
  </div>
</template>
  <!-- Datatable with containing all the open cases -->
        <v-card > 
                <v-card-title>
                 Analysen
                    <div class="flex-grow-1"></div>
                    <v-text-field v-model="search" append-icon="search" label="Suche" 
                    single-line hide-details></v-text-field>
                </v-card-title>
      <v-data-table
      :headers="headers"
      :items="analyses"
      item-key="name"
      :search="search"
      class="elevation-1"  
      no-data-text="keine offene Analysen gefunden - Legen Sie eine neue Analyse an"
    >
      <template v-slot:item.start="{ item }">
     
            <v-icon :color="color" @click="meanValue">
         play_circle_filled 
        </v-icon>
      
      </template>
       
      <template v-slot:item.delete="{ item }">
            <v-icon @click="deleteOpenAnalyse(item._id, item)">
          delete
        </v-icon>
      </template>
    </v-data-table>
   </v-card> </br>
      <v-btn @click="analyseR">Run R</v-btn>
     
  <canvas id="myChart" width="auto" height="100"></canvas>
    </v-container> 
</template>


<script>
import axios from 'axios';
import Chart from 'chart.js';



export default {
//initialize variables
    data: () => ({
      edfName: '/MEPtest2.edf',
      edfData: {},
      lab: [],
    
          breadcrumbs: [
        {
          text: 'Dashboard',
          disabled: false,
          href: 'home',
        },
        {
          text: 'Analyse',
          disabled: true,
          href: 'analysis',
        },
      ],

    color: 'indigo',
        analyses: [],
      search: '',
      headers: [
        { text: 'Durchschnittliche IOM-Dauer', value: 'start', sortable: false },
        { text: 'Bezeichnung.', value: 'name' },
        { text: 'Enthaltene Fälle.', value: 'cases' },
        { text: 'Löschen', value: 'delete', sortable: false },

      ],

    }),

  // fetch all analyses on pageload
  mounted() {
    this.fetchAnalyses();
  },

    methods: {

          // method to fetch all analyses from the database
    async fetchAnalyses() {
      const token = window.localStorage.getItem('auth');
      return axios({
        method: 'get',
        url: '/analyses',
         headers: {
            Authorization: `JWT ${token}`,
            'Content-Type': 'application/json',
          },
      })
        .then((response) => {
          this.analyses = response.data.analyses;
        
        })
        .catch(() => {});
    },

        // delete a Analyse from the database
    async  deleteOpenAnalyse(id, item) {
      const token = window.localStorage.getItem('auth');
      return axios({
        method: 'delete',
        data: {
          id,
        },
        url: `/analyses/${id}`,
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          const index = this.analyses.indexOf(item);
          this.analyses.splice(index, 1);
        })
        .catch(() => {});
    },

    meanValue: function(){
      console.log(this.analyses[0].cases);
      let case1 = this.analyses[0].cases;
      let start = [];
       let end = [];
      for(let i = 0; i < case1.length; i++){
        
          
          start.push(case1[i].entries[0].ts);
        
         
          end.push(case1[i].entries[case1[i].entries.length-1].ts);
      };
  
 
       var res = Math.abs(end[0]  - start[0]) / 1000;
       var minutes = Math.floor(res / 60) % 60;
       console.log(minutes);

    },


//triggers R function on server that emmits r file to R. R file is proccessed in 
//R an the return to the server. Server returns data to frontend and afterwards the signal curves are drawn
   async analyseR(){
      //const token = window.localStorage.getItem('auth');
      return axios({
        method: 'post',
        data: {
            name: this.edfName,
          },
        url: '/ex-async',
         headers: {
           // Authorization: `JWT ${token}`,
            //'Content-Type': 'application/json',
          },
      })
        .then((response) => {
  
      
          this.edfData = response.data;
      
          for(let i = 0; i<this.edfData[ 'Thenar re' ].fragments[0].signal.length; i++){
         this.lab.push(i);
       };
           var ctx = document.getElementById('myChart');
      
      
 //Draw Curves with charts.js     
var myChart = new Chart(ctx, {
    type: 'line',
   
    data:
    { labels: this.lab,
      datasets: [
            {
                label: "Thenar re",
             
                data: this.edfData[ 'Thenar re' ].fragments[0].signal,
                fill: true,
                  lineTension: 0.1,
                  backgroundColor: "rgba(75,192,192,0.4)",
                  borderColor: "rgba(75,192,192,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(75,192,192,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(75,192,192,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                 
                  spanGaps: false,
                
            },
             {
                label: "Tib ant re",
                data: this.edfData[ 'Tib ant re' ].fragments[0].signal,
                fill: true,
                  lineTension: 0.1,
                  backgroundColor: "rgba(204, 235, 52,0.4)",
                  borderColor: "rgba(204, 235, 52,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(204, 235, 52,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(204, 235, 52,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                 
                  spanGaps: false,
                
            }, 
             {
                label: "Extensor re",
                data: this.edfData[ 'Extensor re' ].fragments[0].signal,
                fill: true,
                  lineTension: 0.1,
                  backgroundColor: "rgba(229, 52, 2352,0.4)",
                  borderColor: "rgba(229, 52, 235,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(229, 52, 235,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(229, 52, 235,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                 
                  spanGaps: false,
                
            },
            {
                label: "Deltoideus re",
                data: this.edfData[ 'Deltoideus re' ].fragments[0].signal,
                fill: true,
                  lineTension: 0.1,
                  backgroundColor: "rgba(150, 235, 52,0.4)",
                  borderColor: "rgba(150, 235, 52,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(150, 235, 52,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(150, 235, 52,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                 
                  spanGaps: false,
                
            },]},
   options:{
                 responsive: true, 
             scales: {
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Amplitude [mV]',
         fontStyle: "bold",
      }
    }],
     xAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Latency [ms]',
         fontStyle: "bold",
      }
    }]
  }     
            }
});
        })
        .catch(() => {});

    },


       
},}
</script>
