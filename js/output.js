// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOV1OLi8lJfCPcPPJ0EyEuigjKMrpKa3s",
  authDomain: "congress-2f82b.firebaseapp.com",
  projectId: "congress-2f82b",
  storageBucket: "congress-2f82b.appspot.com",
  messagingSenderId: "124005068423",
  appId: "1:124005068423:web:3b90337f8bad4ecd035222",
  measurementId: "G-P17EPCP1DK"
};
function deleteAllChildren(parent){

    let child = parent.lastElementChild; 
    while (child) {
        if (parent.childElementCount == 1){
            return
        }
        parent.removeChild(child);
        child = parent.lastElementChild;
        
    }
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
if (!(urlParams.has("group"))){
    window.location = "doesntexist.html"
}
const groupName = urlParams.get("group")
// let db = firebase.database().ref('groups/' + groupName + '/data');
// db.on('value', function(snapshot) {
//     console.log(snapshot.value())
// });
// .onWrite((event) => {
//     console.log(event.value())

// })
// on().then((info) => {
//     console.log(info.value())

// })
const rankTable = document.getElementById("rankTable")
const groupDataRef = ref(database, "groups/" + groupName + "/data")
onValue(groupDataRef, (snapshot) => {
    deleteAllChildren(rankTable)

  const data = snapshot.val();
  console.log(data)
  let trackNumQuestion = data["trackNumQuestion"]
  let trackPresQuestion = data["trackPresQuestion"]
  let trackNumSpeech = data["trackNumSpeech"]
  let trackPresSpeech = data["trackPresSpeech"]
  let tbody = document.createElement("tbody")
  for (let i = 0; i < trackPresQuestion.length; i++){
    
    let tr = document.createElement("tr")
    if (i%2 != 0){
        tr.classList.add("active-row")
    }
    let td = document.createElement("td")
    td.textContent = trackNumSpeech[Object.keys(trackNumSpeech)[i]]
    let td2 = document.createElement("td")
    td2.textContent = Object.keys(trackNumSpeech)[i]
    let td3 = document.createElement("td")
    td3.textContent = i + 1
    let td4 = document.createElement("td")
    td4.textContent = trackPresSpeech[i]

    let td5 = document.createElement("td")
    td5.textContent = trackNumQuestion[Object.keys(trackNumQuestion)[i]]
    let td6 = document.createElement("td")
    td6.textContent = Object.keys(trackNumQuestion)[i]
    let td7 = document.createElement("td")
    td7.textContent = i + 1
    let td8 = document.createElement("td")
    td8.textContent = trackPresQuestion[i]

    tr.append(td, td2, td3, td4, td5, td6, td7, td8)
    tbody.appendChild(tr)
  }
  rankTable.appendChild(tbody)
});
