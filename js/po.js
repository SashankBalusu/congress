// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const addConnection = document.getElementById("addConnection")
const delConnection = document.getElementById("delConnection")
const submitConnection = document.getElementById("submitConnection")
const namesCon = document.getElementById("namesCon")
const chamberReal = document.getElementById("chamberReal")
const afterSubmitCon = document.getElementById("afterSubmitCon")
const containReps = document.getElementById("containReps")
const output = document.getElementById("output")
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
const nextCycle = document.getElementById("nextCycle")
const speechquestion = document.getElementById("speechquestion")
let trackPresSpeech = []
let trackNumSpeech = {}
let trackPresQuestion = []
let trackNumQuestion = {}
let mode = "speech"
function deleteAllChildrenButOne(parent){
    let child = parent.lastElementChild; 
    while (child) {
        if (parent.childElementCount == 1){
            return
        }
        parent.removeChild(child);
        child = parent.lastElementChild;
        
    }
}
function resetRepColor(){
    let buttons = document.getElementsByClassName("rep")
    for (let i = 0; i < buttons.length; i++){
        buttons[i].style.backgroundColor = "rgb(61, 90, 128)"
        buttons[i].style.color = "white"
    }
}
function update(){
    deleteAllChildrenButOne(output)
    if (mode == "speech"){
        let buttons = document.getElementsByClassName("rep")
        let repsUp = []
        for (let i = 0; i < buttons.length; i++){
            if (buttons[i].style.backgroundColor == "rgb(238, 108, 77)"){ 
                repsUp.push(buttons[i].textContent)
            }
        }
        for (let i = 0; i < trackPresSpeech.length; i++){
            for (let j = 0; j < repsUp.length; j++){
                if (trackPresSpeech[i] == repsUp[j]){
                    let button = document.createElement("button")
                    button.textContent = repsUp[j]
                    button.classList.add("rep")
                    button.classList.add("sidenavBut")
                    button.style.backgroundColor = "rgb(61, 90, 128)"
                    button.style.color = "white"

                    button.addEventListener("click", function(){
                        if (button.style.backgroundColor == "rgb(61, 90, 128)"){
                            button.style.backgroundColor = "rgb(238, 108, 77)"
                            button.style.color = "black"
                        }
                        else {
                            button.style.backgroundColor = "rgb(61, 90, 128)"
                            button.style.color = "white"
        
                        }
                    })
                    output.appendChild(button)
                    
                }
            }
            
        }
        console.log(repsUp)
    }
    if (mode == "question"){
        let buttons = document.getElementsByClassName("rep")
        let repsUp = []
        for (let i = 0; i < buttons.length; i++){
            if (buttons[i].style.backgroundColor == "rgb(238, 108, 77)"){ 
                repsUp.push(buttons[i].textContent)
            }
        }
        let start = 0.01
        let trackQuestionsNumAndPres = JSON.parse(JSON.stringify(trackNumQuestion));
        for (let i = 0; i < trackPresQuestion.length; i++){
            for (let key in trackQuestionsNumAndPres){

                if (trackPresQuestion[i] == key){
                    trackQuestionsNumAndPres[key] += start
                }
            }
            start += 0.01
        }
        console.log(trackQuestionsNumAndPres)
        console.log(trackNumQuestion)
        let orderedReps = Object.fromEntries(
            Object.entries(trackQuestionsNumAndPres).sort(([, a], [, b]) => a - b)
        )
        console.log(orderedReps)
        for (let key in orderedReps){
            for (let i = 0; i < repsUp.length; i++){
                if (repsUp[i] == key){
                    let button = document.createElement("button")
                    button.textContent = repsUp[i]
                    button.classList.add("rep")
                    button.classList.add("sidenavBut")
                    button.style.backgroundColor = "rgb(61, 90, 128)"
                    button.style.color = "white"

                    button.addEventListener("click", function(){
                        if (button.style.backgroundColor == "rgb(61, 90, 128)"){
                            button.style.backgroundColor = "rgb(238, 108, 77)"
                            button.style.color = "black"

                        }
                        else {
                            button.style.backgroundColor = "rgb(61, 90, 128)"
                            button.style.color = "white"

                        }
                    })
                    output.appendChild(button)
                }
            }
        }
    }

}

if (!(urlParams.has("group"))){
    window.location = "doesntexist.html"
}
const groupName = urlParams.get("group")
let linktogo = document.getElementById("linktogo")
linktogo.textContent = "Chamber/Judges go to: sashankbalusu.github.io/congress/output.html?group=" + groupName
let people = {}
get(ref(database, "groups/" + groupName + "/people")).then((info) => {
    if (!(info.exists())){
        namesCon.setAttribute("style", "display: block")
        addConnection.addEventListener("click", function(){
            let input = document.createElement("input")
            input.type = "text"
            input.classList.add("connectionInput")
            input.required = true
            let label = document.createElement("label")
            label.setAttribute("alt", "Rep. Name")
            label.setAttribute("placeholder", "Rep. Name")
            console.log(label)
            namesCon.insertBefore(label, namesCon.children[namesCon.children.length-4]);
            namesCon.insertBefore(input, namesCon.children[namesCon.children.length-4]);

        })
        delConnection.addEventListener("click", function(){
            console.log(namesCon.children.length)
            if (namesCon.children.length == 8){
                return
            }
            namesCon.removeChild(namesCon.children[namesCon.children.length-5])
            namesCon.removeChild(namesCon.children[namesCon.children.length-5])

        })

        submitConnection.addEventListener("click", function(){
            
            console.log(groupName)
            const po = document.getElementById("username")
            const poname = po.value.toLowerCase()
            const connections = document.getElementsByClassName("connectionInput")
            if (poname.length == 0){
                alert("Enter the po name please")
                return
            }
            let connArr=  []
            for (let i = 0; i < connections.length; i++){
                if (connections[i].value.length == 0){
                    alert("Make sure each rep. name has a value")
                    return
                }
                connArr.push(connections[i].value.toLowerCase())
                
            }
            set(ref(database, "groups/" + groupName + "/people"), {
                po: poname,
                reps: connArr
                
            });
            window.location.reload()
        })

    }
    else {
        people = info.val()
        afterSubmitCon.setAttribute("style", "display: grid;")
        // let h2 = document.createElement("h2")
        // h2.textContent = "PO: " + people["po"]
        // h2.style.marginBottom= "14%"
        // containReps.appendChild(h2)
        let h22 = document.createElement("h2")
        h22.textContent = "Reps: "
        containReps.appendChild(h22)
        let reps = people["reps"]
        for (let el of reps){
            let button = document.createElement("button")
            button.textContent = el
            button.classList.add("rep")
            button.style.backgroundColor = "rgb(61, 90, 128)"
            button.style.color = "white"
            button.style.padding = "4px"
            button.addEventListener("click", function(){
                if (button.style.backgroundColor == "rgb(61, 90, 128)"){
                    button.style.backgroundColor = "rgb(238, 108, 77)"
                    button.style.color = "black"

                }
                else {
                    button.style.backgroundColor = "rgb(61, 90, 128)"
                    button.style.color = "white"


                }
                update()
            })
            containReps.appendChild(button)
            trackPresQuestion.push(el)
            trackPresSpeech.push(el)
            trackNumQuestion[el] = 0
            trackNumSpeech[el] = 0


        }
        nextCycle.addEventListener("click", function(){
            let buttons = document.getElementsByClassName("sidenavBut")
            let received = [] 
            for (let i = 0; i < buttons.length; i++){
                if (buttons[i].style.backgroundColor == "rgb(238, 108, 77)"){ 
                    received.push(buttons[i].textContent)
                }
            }

            //error checking
            if (mode == "speech" && received.length > 1){
                alert("Too many people! More than one person cant give a speech at once.")
                return
            }
            if (received.length == 0){
                alert("Please select the people who got a speech/question")
                return
            }

            if (mode == "speech") {
                trackPresSpeech.push(trackPresSpeech.splice(trackPresSpeech.indexOf(received[0]), 1)[0]);
                deleteAllChildrenButOne(output)
                trackNumSpeech[received[0]] += 1

                mode = "question"
                speechquestion.textContent = "Current Mode: Question"
                resetRepColor()
                set(ref(database, "groups/" + groupName + "/data"), {
                    trackNumQuestion: trackNumQuestion,
                    trackPresQuestion: trackPresQuestion,
                    trackPresSpeech: trackPresSpeech,
                    trackNumSpeech: trackNumSpeech
                    
                });
                return
            }
            if (mode == "question") {
                for (let i = 0; i < received.length; i++){
                    trackNumQuestion[received[i]] += 1
                    trackPresQuestion.push(trackPresQuestion.splice(trackPresQuestion.indexOf(received[i]), 1)[0]);
  
                }
                deleteAllChildrenButOne(output)
                mode = "speech"
                speechquestion.textContent = "Current Mode: Speech"
                resetRepColor()
                set(ref(database, "groups/" + groupName + "/data"), {
                    trackNumQuestion: trackNumQuestion,
                    trackPresQuestion: trackPresQuestion,
                    trackPresSpeech: trackPresSpeech,
                    trackNumSpeech: trackNumSpeech
                    
                });
                return
            }

            console.log(received)
        })
        console.log(people)

      return
    }
    
  }).catch((error) => {
      console.error(error);
  });
