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
const analytics = getAnalytics(app);
const submit = document.getElementById("submit")
submit.addEventListener("click", function(){
    const groupName = document.getElementById("groupName")
    let group = groupName.value
    console.log(group)
    if (group == ""){
        alert("Chamber name field needs a value!")
        return
    }
    const database = getDatabase(app);

    const dbRef = ref(getDatabase());
    
    get(ref(database, "groups/" + group)).then((info) => {
        if (!(info.exists())){
          set(ref(database, "groups/" + group), {
            name: group
            
          });
          
        ''}
        else {
          alert("Chamber name already exists, pick another")
          return
        }
        
      }).catch((error) => {
          console.error(error);
      });''
    window.location.href = "/po.html?group=" + group

})