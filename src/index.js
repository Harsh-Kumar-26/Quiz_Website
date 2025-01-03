import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, query, where, orderBy, serverTimestamp, getDoc,
  updateDoc, setDoc
} from 'firebase/firestore'
import {
  getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged,
  signInAnonymously, updateProfile, deleteUser,
  sendPasswordResetEmail
} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyDDy14HC8x0hylj8qq_kKOPIJqTarNbHco",
  authDomain: "quiz-site-8c774.firebaseapp.com",
  projectId: "quiz-site-8c774",
  storageBucket: "quiz-site-8c774.firebasestorage.app",
  messagingSenderId: "336600619145",
  appId: "1:336600619145:web:1b9763c289c7d6e68e8e58"
};
initializeApp(firebaseConfig);
console.log("Firebase initialized");
// init ends

// Firestore init
const db = getFirestore();

// For Auth
const auth = getAuth();
// Sign Up
if (window.location.pathname.includes("signup")) {
  document.addEventListener("DOMContentLoaded", () => {
    const signupmail = document.querySelector(".signup");
    console.log("Sign up DOM Loaded");
    signupmail.addEventListener("submit", (e) => {
      document.getElementById("loader").style.display = "block";
      document.getElementById("loaderback").style.display = "block";
      e.preventDefault();
      console.log("Submitted")
      const name = signupmail.name.value;
      const mail = document.getElementById("mail").value;
      const pass = document.getElementById("mail_password").value;
      createUserWithEmailAndPassword(auth, mail, pass)
        .then(cred => {
          console.log("No Error");
          const user = cred.user;
          return updateProfile(user, { displayName: name })
            .then(() => {
              console.log("Display name set successfully:", user.displayName);
              document.querySelector("#ep2").style.color = "blue";
              document.querySelector("#ep2").innerHTML = "User Created";
              document.querySelector("#ep2").style.color = "blue";
              document.querySelector("#ep2").innerHTML = "User Created";
              console.log(user.displayName);
              window.location.href = "user_main.html";
              signupmail.reset()
            })
            .catch((error) => {
              console.log("Error");
              document.querySelector("#ep2").style.color = "red";
              document.querySelector("#ep2").innerHTML = error.message;
            })
        })
      document.getElementById("loader").style.display = "none";
      document.getElementById("loaderback").style.display = "none";
    })
  })
}
// Sign Up Ends

// Login
if (window.location.pathname.includes("login.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const loginmail = document.querySelector(".login");
    console.log("Login DOM Loaded");
    loginmail.addEventListener("submit", (e) => {
      document.getElementById("loader").style.display = "block";
      document.getElementById("loaderback").style.display = "block";
      e.preventDefault()
      const mail = document.getElementById("mail1").value;
      const pass = document.getElementById("mail_passowrd1").value;
      signInWithEmailAndPassword(auth, mail, pass)
        .then(cred => {
          console.log("No Error");
          document.querySelector("#ep1").style.color = "blue";
          document.querySelector("#ep1").innerHTML = "User Logined";
          window.location.href = "user_main.html";
          loginmail.reset()
        })
        .catch(error => {
          console.log("Error");
          document.querySelector("#ep1").style.color = "red";
          document.querySelector("#ep1").innerHTML = error.message;
        })
      document.getElementById("loader").style.display = "none";
      document.getElementById("loaderback").style.display = "none";
    })
  })
}
// Login Ends

// Admin Login
if (window.location.pathname.includes("admin_login")) {
  const admlog = collection(db, "admin")
  // let id;
  document.addEventListener("DOMContentLoaded", () => {
    const admlog2 = document.querySelector("#admlog");
    console.log(" Admlog DOM Loaded");
    admlog2.addEventListener("submit", (e) => {
      document.getElementById("loader").style.display = "block";
      document.getElementById("loaderback").style.display = "block";
      e.preventDefault()
      const admail = document.getElementById("admail").value;
      const adpass = document.getElementById("admail_passowrd").value;
      getDocs(admlog)
        .then((snapshot) => {
          let admin = []
          snapshot.docs.forEach((doc) =>
            admin.push({ ...doc.data() }))
          console.log(admin);
          let n = 0;
          for (let i = 0; i < admin.length; i++) {
            if (admail == admin[i].mail && adpass == admin[i].password) {
              n = 1;
              async function ids() {
                try {
                  const q = query(admlog, where("mail", "==", admail));
                  const qsnapshot = await getDocs(q);
                  let id;
                  qsnapshot.forEach((doc) => {
                    id = doc.id;
                  });
                  return id;
                }
                catch {
                  console.log("Error");
                }
              }
              async function call() {
                const id = await ids();
                window.location.href = `admin_main.html?id=${encodeURIComponent(id)}`;
                loginmail.reset()
              }
              call();
            }
          }
          if (n == 0) {
            document.querySelector("#ep3").style.color = "red";
            document.querySelector("#ep3").innerHTML = "Wrong Credentials";
          }
          admin = [];
        })
        .catch((error) => {
          console.log(error);
        })
      document.getElementById("loader").style.display = "none";
      document.getElementById("loaderback").style.display = "none";
    })
  })
}
// Admin Login Ends
// Auth Ends

// Firestore
if (window.location.pathname.includes("quiz_make_page")) {
  const urlParams = new URLSearchParams(window.location.search);
  const id2 = urlParams.get('id');
  console.log(id2);
  document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM Loaded");
    const pos = document.getElementById("saveQuiz");
    pos.addEventListener("click", async (e) => {
      document.getElementById("loader").style.display = "block";
      document.getElementById("loaderback").style.display = "block";
      e.preventDefault()
      const quiz_name = document.getElementById("quizName").value;
      console.log("Quiz name const")
      const admindocref1 = doc(db, 'admin', id2);
      console.log("First refrence made")
      let n1;
      await getDoc(admindocref1)
        .then(docSnapshot => {
          n1 = parseInt(docSnapshot.data().quiz, 10);
          console.log(n1);
          n1 = n1 + 1;
          return updateDoc(admindocref1, { quiz: n1 });
        })
        .catch((error) => {
          console.log(error);
        })
      const subcolRef1 = collection(doc(db, 'admin', id2), n1.toString());
      console.log("Second refrence made")
      console.log("SaveQuiz opened")
      const n = parseInt(document.getElementById('numSections').value, 10);
      const at = 0;
      const up = 0;
      const section_data = [];
      const quiz = {
        name: document.getElementById('quizName').value,
        type: document.getElementById('quiztype').value,
        section_num: document.getElementById('numSections').value,
        discription: document.getElementById('quizdis').value,
        time: parseInt(document.getElementById('hour').value, 10) * 60 + parseInt(document.getElementById('min').value, 10),
        attempt: at,
        upvote: up
      };
      try {
        const docRef = await addDoc(subcolRef1, quiz);
        console.log("Document added to firestore");
      }
      catch (err) {
        document.querySelector("#p2").style.color = "red";
        document.querySelector("#p2").innerHTML = err;
      }
      const questionsarray = [];
      const optiondata = []
      for (let i = 1; i <= n; i++) {
        console.log("Loop 1 open");
        const sectionName = document.getElementById(`sectionName${i}`).value;
        const numQuestions = parseInt(document.getElementById(`numQuestions${i}`).value, 10);

        for (let j = 1; j <= numQuestions; j++) {
          console.log("Loop 2 open");
          const pos4 = document.getElementById(`generateOptions(${i}, ${j})`)
          const question = document.getElementById(`questionText${i}_${j}`).value;
          const options = parseInt(document.getElementById(`numOptions${i}_${j}`).value, 10);
          const posmark = parseInt(document.getElementById(`posmark${i}_${j}`).value, 10);
          const negmark = parseInt(document.getElementById(`negmark${i}_${j}`).value, 10);
          let correct_val;
          for (let k = 1; k <= options; k++) {
            console.log("Loop 3 open");
            const option = document.getElementById(`optionText${i}_${j}_${k}`).value;
            optiondata.push({ option, i, j, k });
            const correct = document.getElementById(`correctOption${i}_${j}_${k}`)
            if (correct.checked) {
              correct_val = k;
            }
          }
          console.log("Loop 3 closed")
          questionsarray.push({ question, options, posmark, negmark, correct_val, i, j });
        }
        console.log("Loop 2 closed")
        section_data.push({ sectionName, numQuestions, i });
      }
      console.log("Loop 1 closed")
      const quiz2 = { questions: questionsarray, sections: section_data, option: optiondata };
      try {
        const docRef2 = await addDoc(subcolRef1, quiz2);
        console.log("Document added to firestore");
        window.location.href = `admin_main.html?id=${encodeURIComponent(id2)}`;
      }
      catch (err) {
        document.querySelector("#p2").style.color = "red";
        document.querySelector("#p2").innerHTML = err;
      }
      document.getElementById("loader").style.display = "none";
      document.getElementById("loaderback").style.display = "none";
    })
  })
}
//Creating Quiz ends

// User Main Page
if (window.location.pathname.includes("user_main")) {
  document.addEventListener("DOMContentLoaded", async () => {
    onAuthStateChanged(auth, (user) => {
      document.getElementById("loader").style.display = "block";
      document.getElementById("loaderback").style.display = "block";
      if (user) {
        console.log("User signed in");
        document.getElementById("main").innerHTML = "Welcome " + user.displayName;
      }
      else {
        console.log("User signed out");
        window.location.href = "index.html";
      }
      document.getElementById("loader").style.display = "none";
      document.getElementById("loaderback").style.display = "none";
    })
  })
}
// User Main Page ends
// Auth reset
if (window.location.pathname.includes("community.html" || "user_custom_quiz_his.html" || "quiz_make_page_user")) {
  document.addEventListener("DOMContentLoaded", async () => {
    onAuthStateChanged(auth, (user) => {
      document.getElementById("loader").style.display = "block";
      document.getElementById("loaderback").style.display = "block";
      if (user) {
        console.log("User signed in");
      }
      else {
        console.log("User signed out");
        window.location.href = "index.html";
      }
      document.getElementById("loader").style.display = "none";
      document.getElementById("loaderback").style.display = "none";
    })
  })
}
// Auth reset ends
if (window.location.pathname.includes("user_profile.html" || "user_custom_quiz_history.html")) {
  document.addEventListener("DOMContentLoaded", async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User signed in");
      }
      else {
        console.log("User signed out");
        window.location.href = "index.html";
      }
    })
  })
}
// Creating Quiz for user

if (window.location.pathname.includes("quiz_make_page_user")) {
  document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM Loaded");
    const pos = document.getElementById("saveQuiz");
    let id2;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        id2 = user.uid;
      }
      else {
        console.log("User signed out");
      }
    })
    pos.addEventListener("click", async (e) => {
      document.getElementById("loader").style.display = "block";
      document.getElementById("loaderback").style.display = "block";
      e.preventDefault()
      const quiz_name = document.getElementById("quizName").value;
      console.log("Quiz name const")
      const userdocref1 = doc(db, 'userquiz', id2);
      console.log("First refrence made")
      let n1;
      try {
        const docSnapshot = await getDoc(userdocref1)
        console.log("hi");
        if (docSnapshot.exists()) {
          console.log("Exist")
          n1 = parseInt(await (docSnapshot.data().quiz), 10);
          console.log("Nan")
          if (!isNaN(n1) && isFinite(n1)) {
            console.log("hello");
            n1 = n1 + 1;
            console.log(n1);
            const n2 = n1;
            await updateDoc(userdocref1, { quiz: n2 });
            console.log(n1);
          }
          else {
            console.log("hihello");
            n1 = 1;
            console.log(n1);
            const n2 = 1;
            await setDoc(userdocref1, { quiz: n2 });
            console.log(n1);
          }
        }
        else {
          console.log("Creating");
          n1 = 1;
          console.log("n1 is")
          console.log(n1);
          const n2 = 1;
          await setDoc(userdocref1, { quiz: n2 });
        }
      }
      catch {
        console.log("Error");
      }
      const subcolRef1 = collection(userdocref1, n1.toString());
      console.log("Second refrence made")
      console.log("SaveQuiz opened")
      const n = parseInt(document.getElementById('numSections').value, 10);
      const at = 0;
      const section_data = [];
      const quiz = {
        name: document.getElementById('quizName').value,
        type: document.getElementById('quiztype').value,
        section_num: document.getElementById('numSections').value,
        discription: document.getElementById('quizdis').value,
        time: parseInt(document.getElementById('hour').value, 10) * 60 + parseInt(document.getElementById('min').value, 10),
        attempt: at
      };
      try {
        const docRef = await addDoc(subcolRef1, quiz);
        console.log("Document added to firestore");
      }
      catch (err) {
        document.querySelector("#p2").style.color = "red";
        document.querySelector("#p2").innerHTML = err;
      }
      const questionsarray = [];
      const optiondata = []
      for (let i = 1; i <= n; i++) {
        console.log("Loop 1 open");
        const sectionName = document.getElementById(`sectionName${i}`).value;
        const numQuestions = parseInt(document.getElementById(`numQuestions${i}`).value, 10);

        for (let j = 1; j <= numQuestions; j++) {
          console.log("Loop 2 open");
          const pos4 = document.getElementById(`generateOptions(${i}, ${j})`)
          const question = document.getElementById(`questionText${i}_${j}`).value;
          const options = parseInt(document.getElementById(`numOptions${i}_${j}`).value, 10);
          const posmark = parseInt(document.getElementById(`posmark${i}_${j}`).value, 10);
          const negmark = parseInt(document.getElementById(`negmark${i}_${j}`).value, 10);
          let correct_val;
          for (let k = 1; k <= options; k++) {
            console.log("Loop 3 open");
            const option = document.getElementById(`optionText${i}_${j}_${k}`).value;
            optiondata.push({ option, i, j, k });
            const correct = document.getElementById(`correctOption${i}_${j}_${k}`)
            if (correct.checked) {
              correct_val = k;
            }
          }
          console.log("Loop 3 closed")
          questionsarray.push({ question, options, posmark, negmark, correct_val, i, j });
        }
        console.log("Loop 2 closed")
        section_data.push({ sectionName, numQuestions, i });
      }
      console.log("Loop 1 closed")
      const quiz2 = { questions: questionsarray, sections: section_data, option: optiondata };
      try {
        const docRef2 = await addDoc(subcolRef1, quiz2);
        console.log("Document added to firestore");
        alert(" Quiz Saved to 'Your Custom Quizzes' ")
        window.location.href = 'user_main.html';
      }
      catch (err) {
        document.querySelector("#p2").style.color = "red";
        document.querySelector("#p2").innerHTML = err;
      }
      document.getElementById("loader").style.display = "none";
      document.getElementById("loaderback").style.display = "none";
    })
  })
}

// User Quiz Creation Ends


//Admin main Quiz show
if (window.location.pathname.includes("admin_main.html")) {
  console.log("Entered the element");
  const urlParams = new URLSearchParams(window.location.search);
  const id3 = urlParams.get('id');
  if (!id3) {
    console.log("Admin signed out");
    window.location.href = "index.html";
  }
  document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderback").style.display = "block";
    console.log("DOM Loaded");
    const admindocref1 = doc(db, 'admin', id3);
    let n1;
    console.log("First refrence")
    await getDoc(admindocref1)
      .then(docSnapshot => {
        n1 = parseInt(docSnapshot.data().quiz, 10);
      })
    console.log(n1);
    for (let i = 0; i < n1; i++) {
      const subcolRef1 = collection(db, 'admin', id3, (i + 1).toString());
      const dataref = await getDocs(subcolRef1);
      for (const doc of dataref.docs) {
        const name = await doc.data().name;
        const type = await doc.data().type;
        if (type) {
          const sectionDiv = document.createElement("div");
          sectionDiv.classList.add("section-container");
          sectionDiv.innerHTML = `<div>Quiz Name: ${name}</div>`;
          const quizhistory = document.getElementById("quizhistory");
          quizhistory.appendChild(sectionDiv);
        }
      }
    }
    const cont = document.getElementsByClassName("section-container");
    console.log(cont);
    document.getElementById("loader").style.display = "none";
    document.getElementById("loaderback").style.display = "none";
    for (let i = 0; i < n1; i++) {
      document.getElementsByClassName("section-container")[i].addEventListener("click", () => {
        const quizloc = (i + 1).toString();
        window.location.href = `leaderboard.html?admid=${encodeURIComponent(id3)}&quizloc=${encodeURIComponent(quizloc)}`;
      })
    }
  })
}
//Admin main Quiz show ends


// User Profile Page
if (window.location.pathname.includes("user_profile")) {
  // Showing names at profile
  document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderback").style.display = "block";
    console.log("DOM Loaded")
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = doc(db, "userattempt", user.uid);
        const dataref = await getDoc(data);
        let attempt;
        try {
          const attemp = "Total Quiz Attempted: " + await (dataref.data().attempt);
          attempt = attemp;
        }
        catch {
          attempt = "Total Quiz Attempted: " + 0;
        }
        console.log("User signed in");
        const name = "Name: " + user.displayName;
        const mail = "Email: " + user.email;
        document.getElementById("named").innerHTML = name;
        document.getElementById("attempt").innerHTML = attempt;
        document.getElementById("email").innerHTML = mail;
        document.getElementById("loader").style.display = "none";
        document.getElementById("loaderback").style.display = "none";
      }
      else {
        console.log("User signed out");
        const name = "none";
        const mail = "none";
      }
    })

  })
  // Logout
  document.getElementById("logout").addEventListener("click", async () => {
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderback").style.display = "block";
    signOut(auth)
      .then(() => {
        alert("Signed Out");
        window.location.href = "index.html";
      })
      .catch((err) => {
        console.log(err);
      })
    document.getElementById("loader").style.display = "none";
    document.getElementById("loaderback").style.display = "none";
  })
  //Delete
  document.getElementById("bt2").addEventListener("click", async () => {
    if (confirm("Are you sure to delete your account")) {
      document.getElementById("loader").style.display = "block";
      document.getElementById("loaderback").style.display = "block";
      const user = auth.currentUser;
      if (user) {
        deleteUser(user)
          .then(() => {
            alert("Account Deleted");
            window.location.href = "index.html";
          })
          .catch(() => {
            alert("Please relogin to delete your account");
          })
      }
      document.getElementById("loader").style.display = "none";
      document.getElementById("loaderback").style.display = "none";
    }
  })
  // Reset mail
  document.getElementById("bt1").addEventListener("click", async () => {
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderback").style.display = "block";
    onAuthStateChanged(auth, (user) => {
      const mail = user.email;
      sendPasswordResetEmail(auth, mail)
        .then(() => {
          if (confirm("Are you sure you want to reset password")) {
            alert("Password reset email sent")
          }
        })
        .catch((err) => {
          console.log(err);
        })
    })
    document.getElementById("loader").style.display = "none";
    document.getElementById("loaderback").style.display = "none";
  })
}
// User Profile Page ends

// images
document.getElementById("loader").style.display = "block";
document.getElementById("loaderback").style.display = "block";
const images = doc(db, 'images', 'images');
getDoc(images)
  .then((snapshot) => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("loaderback").style.display = "none";
    if (window.location.pathname.includes("index.html")) {
      document.getElementById("logo").src = snapshot.data().logo;
      document.getElementById("one").src = snapshot.data().one;
      document.getElementById("two").src = snapshot.data().two;
      document.getElementById("three").src = snapshot.data().three;
      document.getElementById("four").src = snapshot.data().four;
      const n = snapshot.data().bg;
      const n2 = snapshot.data().bgm;
      document.getElementById("Cyberlabs").src = snapshot.data().cl;
      document.getElementById("m").style.backgroundImage = "url('" + n + "')";
      document.getElementById("m").style.backgroundSize = "cover";
      document.body.style.backgroundImage = "url('" + n2 + "')";
    }
    if (window.location.pathname.includes("signup.html") || window.location.pathname.includes("login.html") || window.location.pathname.includes("admin_login.html")) {
      const n2 = snapshot.data().bgm;
      const n = snapshot.data().bg;
      document.body.style.backgroundImage = "url('" + n2 + "')";
      document.getElementById("m").style.backgroundImage = "url('" + n + "')";
      document.getElementById("logo").src = snapshot.data().logo;
    }
    if (window.location.pathname.includes("user_main.html")) {
      const n2 = snapshot.data().bgm;
      document.body.style.backgroundImage = "url('" + n2 + "')";
      const n = snapshot.data().bg;
      document.getElementById("logo").src = snapshot.data().logo;
      document.getElementById("m").style.backgroundImage = "url('" + n + "')";
    }
    if (window.location.pathname.includes("user_profile.html")) {
      const n = snapshot.data().bg;
      const n2 = snapshot.data().bgm;
      document.getElementById("m").style.backgroundImage = "url('" + n + "')";
      document.body.style.backgroundImage = "url('" + n2 + "')";
    }
    if (window.location.pathname.includes("user_profile.html") || window.location.pathname.includes("user_main.html") || window.location.pathname.includes("community") || window.location.pathname.includes("quiz_main")) {
      document.getElementById("Cyberlabs").src = snapshot.data().cl;
    }
    if (window.location.pathname.includes("admin_main.html") || window.location.pathname.includes("user_custom_quiz_his.html") || window.location.pathname.includes("quiz_make_page") || window.location.pathname.includes("community") || window.location.pathname.includes("quiz_main") || window.location.pathname.includes("custom_main")) {
      const n = snapshot.data().bg;
      const n2 = snapshot.data().bgm;
      document.getElementById("m").style.backgroundImage = "url('" + n + "')";
      document.body.style.backgroundImage = "url('" + n2 + "')";
      if (document.getElementById("logo")) {
        document.getElementById("logo").src = snapshot.data().logo;
      }
    }
    if (window.location.pathname.includes("quiz_attempt.html") || window.location.pathname.includes("quiz_custom_attempt.html") || window.location.pathname.includes("quiz_result.html")) {
      const n = snapshot.data().bg;
      const n2 = snapshot.data().bgm;
      document.getElementById("m2").style.backgroundImage = "url('" + n + "')";
      document.body.style.backgroundImage = "url('" + n2 + "')";
      document.getElementById("logo").src = snapshot.data().logo;
    }
    if (window.location.pathname.includes("result_quiz_custom.html")) {
      const n = snapshot.data().bg;
      const n2 = snapshot.data().bgm;
      document.getElementById("m2").style.backgroundImage = "url('" + n + "')";
      document.body.style.backgroundImage = "url('" + n2 + "')";
      document.getElementById("logo").src = snapshot.data().logo;
    }
    if (window.location.pathname.includes("quiz_sol.html")) {
      const n = snapshot.data().bg;
      const n2 = snapshot.data().bgm;
      document.getElementById("m2").style.backgroundImage = "url('" + n + "')";
      document.body.style.backgroundImage = "url('" + n2 + "')";
      document.getElementById("logo").src = snapshot.data().logo;
    }
    if (window.location.pathname.includes("quiz_custom_sol.html")) {
      const n = snapshot.data().bg;
      const n2 = snapshot.data().bgm;
      document.getElementById("m2").style.backgroundImage = "url('" + n + "')";
      document.body.style.backgroundImage = "url('" + n2 + "')";
      document.getElementById("logo").src = snapshot.data().logo;
    }
    if (window.location.pathname.includes("leaderboard.html") || (window.location.pathname.includes("history.html"))) {
      const n = snapshot.data().bg;
      const n2 = snapshot.data().bgm;
      document.getElementById("m2").style.backgroundImage = "url('" + n + "')";
      document.body.style.backgroundImage = "url('" + n2 + "')";
      document.getElementById("logo").src = snapshot.data().logo;
      document.getElementById("Cyberlabs").src = snapshot.data().cl;
    }
    if (window.location.pathname.includes("quiz_result.html") || window.location.pathname.includes("result_quiz_custom.html")) {
      document.getElementById("Cyberlabs").src = snapshot.data().cl;

    }
  })
// image ends

// Logout
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM Loaded");
  if (window.location.pathname.includes("custom_quiz") || window.location.pathname.includes("community")) {
    document.getElementById("logout").addEventListener("click", async () => {
      if (confirm("Are you sure you want to logout?")) {
        document.getElementById("loader").style.display = "block";
        document.getElementById("loaderback").style.display = "block";
        signOut(auth)
          .then(() => {
            alert("Siggned Out");
            window.location.href = "index.html";
          })
          .catch((err) => {
            console.log(err);
          })
        document.getElementById("loader").style.display = "none";
        document.getElementById("loaderback").style.display = "none";
      }
    })
  }
})
// Logout ends

// User Custom Quiz Show
if (window.location.pathname.includes("user_custom_quiz_his.html")) {
  console.log("Inside Quiz Show2");
  document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM Loaded");
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderback").style.display = "block";
    let uid;
    let n1;
    let n2;
    let n3 = 0;
    let absence = 1;
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User signed in");
        uid = user.uid;
        const id = uid;
        console.log(id);
        const admindocref1 = doc(db, 'userquiz', id);
        console.log("First refrence");
        await getDoc(admindocref1)
          .then(docSnapshot => {
            n1 = parseInt(docSnapshot.data().quiz, 10);
            n2 = n1;
          })
          .catch((error) => {
            document.querySelector("#quizhistory").innerHTML = "No Custom Quiz Created";
          })
        console.log(n1);
        for (let i = 0; i < n1; i++) {
          const subcolRef1 = collection(doc(db, 'userquiz', id), (i + 1).toString());
          const dataref = await getDocs(subcolRef1);
          for (const doc of dataref.docs) {
            if (uid == (await doc.data().id)) {
              absence = 0;
            }
          }
          if (absence = 1) {
            dataref.forEach((doc) => {
              const name = doc.data().name;
              if (name) {
                console.log(name);
                const sectionDiv = document.createElement("div");
                sectionDiv.classList.add("section-container");
                sectionDiv.innerHTML = `<div>Quiz Name: ${name}</div>`;
                const quizhistory = document.getElementById("quizhistory");
                console.log(sectionDiv);
                quizhistory.appendChild(sectionDiv);
              }
            })
            n3++;
          }
          absence = 1;
        }
      }
      else {
        console.log("User signed out");
        window.location.href = "index.html";
      }
      console.log(n1);
      absence = 1;
      for (let i = 0; i < n3; i++) {
        document.getElementsByClassName("section-container")[i].addEventListener("click", () => {
          window.location.href = `custom_main.html?quizloc=${encodeURIComponent((i + 1))}`;
        })
      }
    })
    document.getElementById("loader").style.display = "none";
    document.getElementById("loaderback").style.display = "none";
  })
}
// Community
if (window.location.pathname.includes("community.html")) {
  const topic = document.getElementById("subs");
  const sorting = document.getElementById("sort");
  console.log("Inside Quiz Show2");
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Hi");
  })
  document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM Loaded");
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderback").style.display = "block";
    const urlParams = new URLSearchParams(window.location.search);
    const sort = urlParams.get('sort');
    const sub = urlParams.get('sub');
    topic.value = sub;
    sorting.value = sort;
    let n1;
    let n2 = 0;
    let n3 = 0;
    topic.addEventListener("change", () => {
      const val = topic.value;
      window.location.href = `community.html?sub=${encodeURIComponent(val)}&sort=${encodeURIComponent(sort)}`;
    })
    sorting.addEventListener("change", () => {
      const val = sorting.value;
      window.location.href = `community.html?sub=${encodeURIComponent(sub)}&sort=${encodeURIComponent(val)}`;
    })
    async function getDocumentIds(colname) {
      try {
        console.log("Inside getDocumentIds");
        const snapshot = await getDocs(collection(db, colname));
        const docIds = snapshot.docs.map(doc => doc.id);
        return docIds;
      } catch (error) {
        console.error("Error fetching document IDs:", error);
        return [];
      }
    }
    let id = [];
    await getDocumentIds("admin").then((admid) => {
      id = admid;
    })
    let uid;
    let usname;
    let absence = 1;
    console.log(id);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User signed in");
        uid = user.uid;
        let arr = [];
        for (let i = 0; i < id.length; i++) {
          const id_adm = id[i];
          console.log(id_adm);
          console.log(uid);
          const admindocref1 = doc(db, 'admin', id_adm);
          console.log("Admin refrence")
          await getDoc(admindocref1)
            .then(async (docSnapshot) => {
              n1 = parseInt(await docSnapshot.data().quiz, 10);
              n2 = n2 + n1;
            })
          console.log(n1);
          console.log("First refrence")
          await getDoc(admindocref1)
          const sort = document.getElementById("sort").value;
          if (sort == "select") {
            for (let j = 0; j < n1; j++) {
              const subcolRef1 = collection(admindocref1, (j + 1).toString());
              const dataref = await getDocs(subcolRef1);
              for (const doc of dataref.docs) {
                if (uid == (await doc.data().id)) {
                  absence = 0;
                }
              }
              if (absence == 1) {
                for (const doc of dataref.docs) {
                  const name = await doc.data().name;
                  const type = await doc.data().type;
                  let attempt = await doc.data().attempt;
                  let upvote = await doc.data().upvote;
                  if (!attempt) {
                    attempt = 0;
                  }
                  if (!upvote) {
                    upvote = 0;
                  }
                  console.log(name);
                  console.log(absence);
                  if (type && ((topic.value == type) || (topic.value == "all"))) {
                    n3++;
                    const sectionDiv = document.createElement("div");
                    sectionDiv.classList.add("section-container");
                    sectionDiv.innerHTML = `<div class="name" id='${j}' >Quiz Name: ${name}</div>
            <div class="admin" id='${id_adm}'></div>
            <div class="data">
            <div class="upvote" >Total Upvotes: ${upvote}</div>
            <div class="attempt" >Total attempts: ${attempt}</div>
            </div>`;
                    const container = document.getElementById("container");
                    container.appendChild(sectionDiv);
                  }
                }
              }
              absence = 1;
            }
          }
          else {
            absence = 1;
            for (let j = 0; j < n1; j++) {
              const subcolRef1 = collection(admindocref1, (j + 1).toString());
              const dataref = await getDocs(subcolRef1);
              for (const doc of dataref.docs) {
                if (uid == (await doc.data().id)) {
                  absence = 0;
                }
              }
              if (absence == 1) {
                dataref.forEach(async (doc) => {
                  const name = await doc.data().name;
                  const type = await doc.data().type;
                  let attempt = await doc.data().attempt;
                  let upvote = await doc.data().upvote;
                  if (!attempt) {
                    attempt = 0;
                  }
                  if (!upvote) {
                    upvote = 0;
                  }
                  if (type) {
                    let arr2 = [name, type, attempt, upvote];
                    arr.push(arr2);
                  }
                })
              }
            }

          }
        }
        document.getElementById("valued").style.display = "none";
        let sortedArray;
        if (sort == "attempt") {
          let x = 2;
          sortedArray = sort2DArray(arr, x);
          console.log(sortedArray);
        }
        else if (sort == "Upvote") {
          let x = 3;
          sortedArray = sort2DArray(arr, x);
          console.log(sortedArray);
        }
        if (sort == "attempt" || sort == "Upvote") {
          for (let i = 0; i <= sortedArray.length; i++)
            if (sortedArray[i][1] && ((topic.value == sortedArray[i][1]) || (topic.value == "all"))) {
              const sectionDiv = document.createElement("div");
              sectionDiv.classList.add("section-container");
              sectionDiv.innerHTML = `<div class="name" id='${i}' >Quiz Name: ${sortedArray[i][0]}</div>
            <div class="admin"></div>
            <div class="data">
            <div class="upvote" >Total Upvotes: ${sortedArray[i][3]}</div>
            <div class="attempt" >Total attempts: ${sortedArray[i][2]}</div>
            </div>`;
              const container = document.getElementById("container");
              container.appendChild(sectionDiv);
            }
        }
      }

      else {
        console.log("User signed out");
        window.location.href = "index.html";
      }
      console.log("Outside")
      console.log(document.getElementsByClassName("section-container"));
      for (let i = 0; i < n3; i++) {
        document.getElementsByClassName("section-container")[i].addEventListener("click", () => {
          const admloc = document.getElementsByClassName("admin")[i].id;
          const quizloc = (parseInt(document.getElementsByClassName("name")[i].id, 10) + 1).toString();
          window.location.href = `quiz_main.html?admloc=${encodeURIComponent(admloc)}&quizloc=${encodeURIComponent(quizloc)}`;
        })
      }
    })
    document.getElementById("loader").style.display = "none";
    document.getElementById("loaderback").style.display = "none";
  })
}
// Community ends

// Quiz First Page
if (window.location.pathname.includes("quiz_main")) {
  document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderback").style.display = "block";
    console.log("DOM Loaded");
    let tleft;
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User signed in");
        const urlParams = new URLSearchParams(window.location.search);
        const admid = urlParams.get('admloc');
        const quizloc = urlParams.get('quizloc');
        if (!admid) {
          window.location.href = "index.html";
        }
        console.log(admid);
        console.log(quizloc);
        const quizref = collection(doc(db, 'admin', admid), quizloc);
        console.log("First refrence")
        const quizdata = await getDocs(quizref);
        quizdata.forEach(async (doc) => {
          let net_q = 0;
          const name = await doc.data().name;
          const attempt = await doc.data().attempt;
          const type = await doc.data().type;
          const discription = await doc.data().discription;
          let time = await doc.data().time;
          const hour = Math.floor(time / 60);
          const min = time % 60;
          const section_num = parseInt(await doc.data().section_num, 10);
          const sections = await doc.data().sections;
          console.log(type);
          console.log(sections);
          console.log(section_num);
          if (sections) {
            sections.forEach((section) => {
              const sectionName = section.sectionName;
              const question = section.numQuestions;
              const sectionDiv = document.createElement("div");
              sectionDiv.classList.add("section-container");
              sectionDiv.innerHTML =
                `<div class="section-name">Section Name: ${sectionName}</div>
        <div class="section-ques">Total Questions: ${question}</div><br><br>`;
              const sectiondata = document.getElementById("sectiondata");
              sectiondata.appendChild(sectionDiv);
            })
          }
          if (time) {
            document.getElementById("container").innerHTML =
              `<div id="namequiz">${name}</div>
      <div id="data">
      <div class='data' id="type">Topic: ${type}</div>
      <div class='data' id="time">Total Time: ${hour}:${min}:00 (${time}min)</div>
      <div class='data' id="section_num">Total Number of Sections: ${section_num}</div>
      <div class='data' id="discription">Quiz Discription: ${discription}</div>
      </div>`
          }
          document.getElementById("sq").addEventListener("click", () => {
            window.location.href = `quiz_attempt.html?admid=${encodeURIComponent(admid)}&quizloc=${encodeURIComponent(quizloc)}`;
          })
        })
      }
      else {
        console.log("User signed out");
        window.location.href = "index.html";
      }
      document.getElementById("loader").style.display = "none";
      document.getElementById("loaderback").style.display = "none";
    })
  })
}
// Quiz First Page ends


// Quiz Questions
if (window.location.pathname.includes("quiz_attempt.html")) {
  document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderback").style.display = "block";
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        let time;
        let time2;
        let name2;
        console.log("User signed in");
        const urlParams = new URLSearchParams(window.location.search);
        const admid = urlParams.get('admid');
        const quizloc = urlParams.get('quizloc');
        if (!admid) {
          window.location.href = "index.html";
        }
        const quizref = collection(db, 'admin', admid, quizloc);
        console.log("First refrence");
        const quizdata = await getDocs(quizref);
        await quizdata.forEach(async (doc2) => {
          let net_q = 0;
          const name = await doc2.data().name;
          console.log(name);
          const attempt = await doc2.data().attempt;
          const type = await doc2.data().type;
          time = await doc2.data().time;
          if (time) {
            time2 = time;
            console.log(time2);
            name2 = name;
            const id = doc2.id;
            console.log(id);
            const docref = doc(quizref, id);
            const upattempt = parseInt(attempt, 10) + 1;
            console.log(upattempt);
            await updateDoc(docref, { attempt: upattempt });
            console.log("Attempt done");
          }
          const hour = Math.floor(time / 60);
          const min = time % 60;
          const sections = await doc2.data().sections;
          const questions = await doc2.data().questions;
          const options = await doc2.data().option;
          if (sections) {
            console.log("Sections" + sections);
            console.log("Q" + questions);
            console.log("O" + options);
            const section_num = sections.length;
            await sections.forEach((section) => {
              net_q = net_q + section.numQuestions;
            })
            console.log(net_q);
            let n = 0;
            let n2 = 0;
            for (let i = 1; i <= section_num; i++) {
              const question_num = sections[i - 1].numQuestions;
              for (let j = 1; j <= question_num; j++) {
                const options_num = questions[n].options;
                const quesDiv = document.createElement("div");
                const posmark = questions[n].posmark;
                const negmark = questions[n].negmark;
                quesDiv.classList.add("ques-container");
                quesDiv.innerHTML =
                  `<div class=marks><div class=marks2><div class=pos>+${posmark}</div><div class=ane>|</div><div class=neg>-${negmark}</div></div></div><div class=section>Section ${i}:   ${sections[i - 1].sectionName}</div><div class="question"><span style="font-weight:bold">${j}.</span>  ${questions[n].question}</div><br><br><br>`
                for (let k = 1; k <= options_num; k++) {
                  const optiondiv = document.createElement("div");
                  optiondiv.classList.add("option-container");
                  optiondiv.innerHTML = `<input type="radio" id="option${k}" class="${i}${j}" value="${k}"><div>${options[n2].option}</div>`;
                  quesDiv.appendChild(optiondiv);
                  n2++;
                }
                const quesend = document.createElement("div");
                quesend.classList.add("quesend");
                quesend.innerHTML = `<button class="but1" id="next${i}${j}">Previous</button><button class="but2" id="next${i}${j}">Next</button>`;
                quesDiv.appendChild(quesend);
                document.getElementById("m2").appendChild(quesDiv);
                n++;
              }
            }
            const lenbut2 = document.getElementsByClassName("but2").length;
            document.getElementsByClassName("but2")[lenbut2 - 1].style.display = "none";
            document.getElementsByClassName("ques-container")[0].style.display = "block";
            document.getElementsByClassName("but1")[0].style.display = "none";
            document.getElementById("loader").style.display = "none";
            document.getElementById("loaderback").style.display = "none";
            for (let i = 0; i < (lenbut2 - 1); i++) {
              document.getElementsByClassName("but2")[i].addEventListener("click", () => {
                document.getElementsByClassName("ques-container")[i].style.display = "none";
                document.getElementsByClassName("ques-container")[i + 1].style.display = "block";
              })
            }
            for (let i = 0; i < lenbut2; i++) {
              document.getElementsByClassName("but1")[i].addEventListener("click", () => {
                document.getElementsByClassName("ques-container")[i].style.display = "none";
                document.getElementsByClassName("ques-container")[i - 1].style.display = "block";
              })
            }

            console.log("Length of qs" + lenbut2);
            document.getElementsByClassName("but2")[lenbut2 - 1].addEventListener("click", async () => {
              const id = (user.uid).toString();
              const userquizattempts = doc(db, 'userattempt', id);
              const docSnapshot = await getDoc(userquizattempts);
              let at;
              if (docSnapshot.exists()) {
                at = parseInt(await (docSnapshot.data().attempt), 10);
                console.log("Exist")
                if (!isNaN(at) && isFinite(at)) {
                  at = at + 1;
                  const at2 = at;
                  await updateDoc(userquizattempts, { attempt: at2 });
                  console.log(at2);
                }
                else {
                  at = 1;
                  console.log(at);
                  const at2 = 1;
                  await setDoc(userquizattempts, { attempt: at2 });
                  console.log(at2);
                }
              }
              else {
                console.log("Creating");
                at = 1;
                const at2 = 1;
                console.log(at2);
                await setDoc(userquizattempts, { attempt: at2 });
              }
              console.log("Value of at " + at);
              const userquizdata = collection(userquizattempts, at.toString());
              console.log(userquizdata);
              console.log(section_num);
              n = 0;
              let ques = [];
              let sec = [];
              let net_score = 0;
              console.log("Start");
              for (let i = 1; i <= section_num; i++) {
                sec[i - 1] = 0;
                const question_num = sections[i - 1].numQuestions;
                for (let j = 1; j <= question_num; j++) {
                  ques[n] = 0;
                  const options_num = questions[n].options;
                  const correct = questions[n].correct_val;
                  const posmark = questions[n].posmark;
                  const negmark = questions[n].negmark;
                  const options = document.getElementsByClassName(`${i}${j}`);
                  const len = options.length;
                  for (let k = 0; k < len; k++) {
                    if (options[k].checked) {
                      if (options[k].value == correct) {
                        net_score = net_score + posmark;
                        ques[n] = 2;
                        sec[i - 1] = sec[i - 1] + posmark;
                      }
                      else {
                        net_score = net_score - negmark;
                        ques[n] = 1;
                        sec[i - 1] = sec[i - 1] - negmark;
                      }
                    }
                  }
                  n++;
                }
              }
              console.log(ques);
              console.log(sec);
              console.log(net_score);
              const ques2 = ques;
              const sec2 = sec;
              const net_score2 = net_score;
              const quizdatasub = {
                name: name2,
                ques_data: ques2,
                sec_marks: sec2,
                net_marks: net_score2,
                at: true,
                cat: 1,
                quizloc: quizloc,
                admid: admid
              }
              if (name2) {
                const docref = await addDoc(userquizdata, quizdatasub);
              }
              console.log("Document added to firestore");
              window.location.href = `quiz_result.html?admid=${encodeURIComponent(admid)}&quizloc=${encodeURIComponent(quizloc)}`;
            })
            document.getElementById("submit2").addEventListener("click", async () => {
              if (confirm("Are you sure you want to SUBMIT?")) {
                document.getElementById("loader").style.display = "block";
                document.getElementById("loaderback").style.display = "block";
                const id = (user.uid).toString();
                const userquizattempts = doc(db, 'userattempt', id);
                const docSnapshot = await getDoc(userquizattempts);
                let at;
                if (docSnapshot.exists()) {
                  at = parseInt(await (docSnapshot.data().attempt), 10);
                  console.log("Exist")
                  if (!isNaN(at) && isFinite(at)) {
                    at = at + 1;
                    const at2 = at;
                    await updateDoc(userquizattempts, { attempt: at2 });
                    console.log(at2);
                  }
                  else {
                    at = 1;
                    console.log(at);
                    const at2 = 1;
                    await setDoc(userquizattempts, { attempt: at2 });
                    console.log(at2);
                  }
                }
                else {
                  console.log("Creating");
                  at = 1;
                  const at2 = 1;
                  console.log(at2);
                  await setDoc(userquizattempts, { attempt: at2 });
                }
                console.log("Value of at " + at);
                const userquizdata = collection(userquizattempts, at.toString());
                console.log(section_num);
                n = 0;
                let ques = [];
                let sec = [];
                let net_score = 0;
                console.log("Start");
                for (let i = 1; i <= section_num; i++) {
                  sec[i - 1] = 0;
                  const question_num = sections[i - 1].numQuestions;
                  for (let j = 1; j <= question_num; j++) {
                    ques[n] = 0;
                    const options_num = questions[n].options;
                    const correct = questions[n].correct_val;
                    const posmark = questions[n].posmark;
                    const negmark = questions[n].negmark;
                    const options = document.getElementsByClassName(`${i}${j}`);
                    const len = options.length;
                    for (let k = 0; k < len; k++) {
                      if (options[k].checked) {
                        if (options[k].value == correct) {
                          net_score = net_score + posmark;
                          ques[n] = 2;
                          sec[i - 1] = sec[i - 1] + posmark;
                        }
                        else {
                          net_score = net_score - negmark;
                          ques[n] = 1;
                          sec[i - 1] = sec[i - 1] - negmark;
                        }
                      }
                    }
                    n++;
                  }
                }
                console.log(ques);
                console.log(sec);
                console.log(net_score);
                const ques2 = ques;
                const sec2 = sec;
                const net_score2 = net_score;
                console.log(name2);
                const quizdatasub = {
                  name: name2,
                  ques_data: ques2,
                  sec_marks: sec2,
                  net_marks: net_score2,
                  at: true,
                  cat: 1,
                  quizloc: quizloc,
                  admid: admid
                }
                console.log(quizdatasub);
                if (name2) {
                  const docref = await addDoc(userquizdata, quizdatasub);
                  console.log("Document added to firestore!");
                }
                const net_score3 = net_score;
                const id2 = user.uid;
                console.log(id2);
                const data = { name: user.displayName, id: id2, marks: net_score3 };
                const docadd = await addDoc(quizref, data);
                console.log(admid);
                console.log(quizloc);
                document.getElementById("loader").style.display = "none";
                document.getElementById("loaderback").style.display = "none";
                window.location.href = `quiz_result.html?admid=${encodeURIComponent(admid)}&quizloc=${encodeURIComponent(quizloc)}`;
              }
            })
            console.log("Time");
            console.log(time2);
            // Timer fxn
            if (time2) {
              Timer();
            }
            async function Timer() {
              const timer = document.getElementById("timer");
              let min = time2 % 60;
              let hour = Math.floor(time2 / 60);
              let sec = 0;
              let time3 = time2 * 60;
              let minhr;
              const interval = setInterval(async () => {
                if (time3 > 0) {
                  time3--;
                  sec = time3 % 60;
                  minhr = Math.floor(time3 / 60);
                  hour = Math.floor(minhr / 60);
                  min = minhr % 60;
                  timer.innerHTML = `Time Left: ${hour}:${min}:${sec}`;
                  if (time3 <= 30 && (sec % 2 == 0)) {
                    timer.style.color = "red";
                  }
                  else if (time3 <= 30 && (sec % 2 != 0)) {
                    timer.style.color = "black";
                  }

                }
                if ((time3 <= 0) || (!(window.location.pathname.includes("quiz_attempt.html")))) {
                  clearInterval(interval);
                  timer.innerHTML = "Time Over";
                  const id = (user.uid).toString();
                  const userquizattempts = doc(db, 'userattempt', id);
                  const docSnapshot = await getDoc(userquizattempts);
                  let at;
                  if (docSnapshot.exists()) {
                    at = parseInt(await (docSnapshot.data().attempt), 10);
                    console.log("Exist")
                    if (!isNaN(at) && isFinite(at)) {
                      at = at + 1;
                      const at2 = at;
                      await updateDoc(userquizattempts, { attempt: at2 });
                      console.log(at2);
                    }
                    else {
                      at = 1;
                      console.log(at);
                      const at2 = 1;
                      await setDoc(userquizattempts, { attempt: at2 });
                      console.log(at2);
                    }
                  }
                  else {
                    console.log("Creating");
                    at = 1;
                    const at2 = 1;
                    console.log(at2);
                    await setDoc(userquizattempts, { attempt: at2 });
                  }
                  console.log("Value of at " + at);
                  const userquizdata = collection(userquizattempts, at.toString());
                  console.log(userquizdata);
                  console.log(section_num);
                  n = 0;
                  let ques = [];
                  let sec = [];
                  let net_score = 0;
                  console.log("Start");
                  for (let i = 1; i <= section_num; i++) {
                    sec[i - 1] = 0;
                    const question_num = sections[i - 1].numQuestions;
                    for (let j = 1; j <= question_num; j++) {
                      ques[n] = 0;
                      const options_num = questions[n].options;
                      const correct = questions[n].correct_val;
                      const posmark = questions[n].posmark;
                      const negmark = questions[n].negmark;
                      const options = document.getElementsByClassName(`${i}${j}`);
                      const len = options.length;
                      for (let k = 0; k < len; k++) {
                        if (options[k].checked) {
                          if (options[k].value == correct) {
                            net_score = net_score + posmark;
                            ques[n] = 2;
                            sec[i - 1] = sec[i - 1] + posmark;
                          }
                          else {
                            net_score = net_score - negmark;
                            ques[n] = 1;
                            sec[i - 1] = sec[i - 1] - negmark;
                          }
                        }
                      }
                      n++;
                    }
                  }
                  console.log(ques);
                  console.log(sec);
                  console.log(net_score);
                  const ques2 = ques;
                  const sec2 = sec;
                  const net_score2 = net_score;
                  console.log(name2);
                  const quizdatasub = {
                    name: name2,
                    ques_data: ques2,
                    sec_marks: sec2,
                    net_marks: net_score2,
                    at: true,
                    cat: 1,
                    quizloc: quizloc,
                    admid: admid,
                  }
                  console.log(quizdatasub);
                  if (name2) {
                    const docref = await addDoc(userquizdata, quizdatasub);
                    console.log("Document added to firestore");
                  }
                  const net_score3 = net_score;
                  const data = { name: user.displayName, id: user.uid, marks: net_score3 };
                  const docadd = await addDoc(quizref, data);
                  window.location.href = `quiz_result.html?admid=${encodeURIComponent(admid)}&quizloc=${encodeURIComponent(quizloc)}`;
                }
              }, 1000)
            }
          }
        })
      }
      else {
        console.log("User signed out");
        window.location.href = 'index.html';
      }
    })
  })
}

// Custom Quiz First page
if (window.location.pathname.includes("custom_main")) {
  document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM Loaded");
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        document.getElementById("loader").style.display = "block";
        document.getElementById("loaderback").style.display = "block";
        console.log("User signed in");
        const urlParams = new URLSearchParams(window.location.search);
        const quizloc = urlParams.get('quizloc');
        if (!quizloc) {
          window.location.href = "index.html";
        }
        console.log(quizloc);
        const quizref = collection(doc(db, 'userquiz', user.uid), quizloc);
        console.log("First refrence")
        const quizdata = await getDocs(quizref);
        quizdata.forEach(async (doc) => {
          let net_q = 0;
          const name = await doc.data().name;
          const attempt = await doc.data().attempt;
          const type = await doc.data().type;
          const discription = await doc.data().discription;
          let time = await doc.data().time;
          const hour = Math.floor(time / 60);
          const min = time % 60;
          const section_num = parseInt(await doc.data().section_num, 10);
          const sections = await doc.data().sections;
          console.log(type);
          console.log(sections);
          console.log(section_num);
          if (sections) {
            sections.forEach((section) => {
              const sectionName = section.sectionName;
              const question = section.numQuestions;
              const sectionDiv = document.createElement("div");
              sectionDiv.classList.add("section-container");
              sectionDiv.innerHTML =
                `<div class="section-name">Section Name: ${sectionName}</div>
        <div class="section-ques">Total Questions: ${question}</div><br><br>`;
              const sectiondata = document.getElementById("sectiondata");
              sectiondata.appendChild(sectionDiv);
            })
          }
          if (time) {
            document.getElementById("container").innerHTML =
              `<div id="namequiz">${name}</div>
      <div id="data">
      <div class='data' id="type">Topic: ${type}</div>
      <div class='data' id="time">Total Time: ${hour}:${min}:00 (${time}min)</div>
      <div class='data' id="section_num">Total Number of Sections: ${section_num}</div>
      <div class='data' id="discription">Quiz Discription: ${discription}</div>
      </div>`
          }
          document.getElementById("sq").addEventListener("click", () => {
            window.location.href = `quiz_custom_attempt.html?quizloc=${encodeURIComponent(quizloc)}`;
            document.getElementById("loader").style.display = "none";
            document.getElementById("loaderback").style.display = "none";
          })
        })
      }
      else {
        console.log("User signed out");
        window.location.href = "index.html";
      }
    })
  })
}
// Custom quiz first page ends


// Custom quiz attempt
if (window.location.pathname.includes("quiz_custom_attempt")) {
  document.addEventListener("DOMContentLoaded", async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        document.getElementById("loader").style.display = "block";
        document.getElementById("loaderback").style.display = "block";
        let time;
        let time3;
        let name2;
        console.log("User signed in");
        const urlParams = new URLSearchParams(window.location.search);
        const quizloc = urlParams.get('quizloc');
        if (!quizloc) {
          window.location.href = "index.html";
        }
        const quizref = collection(db, 'userquiz', user.uid, quizloc);
        console.log("First refrence");
        const quizdata = await getDocs(quizref);
        await quizdata.forEach(async (doc2) => {
          let net_q = 0;
          const name = await doc2.data().name;
          if (name) {
            console.log(name);
            name2 = name;
          }
          const attempt = await doc2.data().attempt;
          const type = await doc2.data().type;
          time = await doc2.data().time;
          if (name) {
            time3 = time;
            const id = doc2.id;
            console.log(id);
            const docref = doc(quizref, id);
            await updateDoc(docref, { attempt: (attempt + 1) });
            console.log("Attempt done");
          }

          const hour = Math.floor(time / 60);
          const min = time % 60;
          const sections = await doc2.data().sections;
          const questions = await doc2.data().questions;
          const options = await doc2.data().option;
          if (sections) {
            console.log("Sections" + sections);
            console.log("Q" + questions);
            console.log("O" + options);
            const section_num = sections.length;
            await sections.forEach((section) => {
              net_q = net_q + section.numQuestions;
            })
            console.log(net_q);
            let n = 0;
            let n2 = 0;
            for (let i = 1; i <= section_num; i++) {
              const question_num = sections[i - 1].numQuestions;
              for (let j = 1; j <= question_num; j++) {
                const options_num = questions[n].options;
                const quesDiv = document.createElement("div");
                const posmark = questions[n].posmark;
                const negmark = questions[n].negmark;
                quesDiv.classList.add("ques-container");
                quesDiv.innerHTML =
                  `<div class=marks><div class=marks2><div class=pos>+${posmark}</div><div class=ane>|</div><div class=neg>-${negmark}</div></div></div><div class=section>Section ${i}:   ${sections[i - 1].sectionName}</div><div class="question"><span style="font-weight:bold">${j}.</span>  ${questions[n].question}</div><br><br><br>`
                for (let k = 1; k <= options_num; k++) {
                  const optiondiv = document.createElement("div");
                  optiondiv.classList.add("option-container");
                  optiondiv.innerHTML = `<input type="radio" id="option${k}" class="${i}${j}" value="${k}"><div>${options[n2].option}</div>`;
                  quesDiv.appendChild(optiondiv);
                  n2++;
                }
                const quesend = document.createElement("div");
                quesend.classList.add("quesend");
                quesend.innerHTML = `<button class="but1" id="next${i}${j}">Previous</button><button class="but2" id="next${i}${j}">Next</button>`;
                quesDiv.appendChild(quesend);
                document.getElementById("m2").appendChild(quesDiv);
                n++;
              }
            }
            document.getElementsByClassName("but1")[0].style.display = "none";
            const lenbut2 = document.getElementsByClassName("but2").length;
            document.getElementsByClassName("but2")[lenbut2 - 1].style.display = "none";
            document.getElementsByClassName("ques-container")[0].style.display = "block";
            for (let i = 0; i < (lenbut2 - 1); i++) {
              document.getElementsByClassName("but2")[i].addEventListener("click", () => {
                document.getElementsByClassName("ques-container")[i].style.display = "none";
                document.getElementsByClassName("ques-container")[i + 1].style.display = "block";
              })
            }
            for (let i = 0; i < lenbut2; i++) {
              document.getElementsByClassName("but1")[i].addEventListener("click", () => {
                document.getElementsByClassName("ques-container")[i].style.display = "none";
                document.getElementsByClassName("ques-container")[i - 1].style.display = "block";
              })
            }
            document.getElementById("loader").style.display = "none";
            document.getElementById("loaderback").style.display = "none";
            console.log("Length of qs" + lenbut2);
            document.getElementsByClassName("but2")[lenbut2 - 1].addEventListener("click", async () => {
              document.getElementById("loader").style.display = "block";
              document.getElementById("loaderback").style.display = "block";
              const id = (user.uid).toString();
              const userquizattempts = doc(db, 'userattempt', id);
              const docSnapshot = await getDoc(userquizattempts);
              let at;
              if (docSnapshot.exists()) {
                at = parseInt(await (docSnapshot.data().attempt), 10);
                console.log("Exist")
                if (!isNaN(at) && isFinite(at)) {
                  at = at + 1;
                  const at2 = at;
                  await updateDoc(userquizattempts, { attempt: at2 });
                  console.log(at2);
                }
                else {
                  at = 1;
                  console.log(at);
                  const at2 = 1;
                  await setDoc(userquizattempts, { attempt: at2 });
                  console.log(at2);
                }
              }
              else {
                console.log("Creating");
                at = 1;
                const at2 = 1;
                console.log(at2);
                await setDoc(userquizattempts, { attempt: at2 });
              }
              console.log("Value of at " + at);
              const userquizdata = collection(userquizattempts, at.toString());
              console.log(userquizdata);
              console.log(section_num);
              n = 0;
              let ques = [];
              let sec = [];
              let net_score = 0;
              console.log("Start");
              for (let i = 1; i <= section_num; i++) {
                sec[i - 1] = 0;
                const question_num = sections[i - 1].numQuestions;
                // console.log(question_num);
                for (let j = 1; j <= question_num; j++) {
                  ques[n] = 0;
                  const options_num = questions[n].options;
                  const correct = questions[n].correct_val;
                  const posmark = questions[n].posmark;
                  const negmark = questions[n].negmark;
                  // console.log(correct);
                  const options = document.getElementsByClassName(`${i}${j}`);
                  const len = options.length;
                  // console.log(len);
                  // console.log(options);
                  for (let k = 0; k < len; k++) {
                    if (options[k].checked) {
                      if (options[k].value == correct) {
                        net_score = net_score + posmark;
                        ques[n] = 2;
                        sec[i - 1] = sec[i - 1] + posmark;
                      }
                      else {
                        net_score = net_score - negmark;
                        ques[n] = 1;
                        sec[i - 1] = sec[i - 1] - negmark;
                      }
                    }
                  }
                  n++;
                }
              }
              console.log(ques);
              console.log(sec);
              console.log(net_score);
              const ques2 = ques;
              const sec2 = sec;
              const net_score2 = net_score;
              console.log(name2);
              const quizdatasub = {
                name: name2,
                ques_data: ques2,
                sec_marks: sec2,
                net_marks: net_score2,
                at: true,
                cat: 2,
                quizloc: quizloc
              }
              console.log(quizdatasub);
              if (name) {
                const docref = await addDoc(userquizdata, quizdatasub);
              }
              console.log("Document added to firestore");
              window.location.href = `result_quiz_custom.html?quizloc=${encodeURIComponent(quizloc)}`;
              document.getElementById("loader").style.display = "none";
              document.getElementById("loaderback").style.display = "none";
            })
            document.getElementById("submit2").addEventListener("click", async () => {
              document.getElementById("loader").style.display = "block";
              document.getElementById("loaderback").style.display = "block";
              const id = (user.uid).toString();
              const userquizattempts = doc(db, 'userattempt', id);
              const docSnapshot = await getDoc(userquizattempts);
              let at;
              if (docSnapshot.exists()) {
                at = parseInt(await (docSnapshot.data().attempt), 10);
                console.log("Exist")
                if (!isNaN(at) && isFinite(at)) {
                  at = at + 1;
                  const at2 = at;
                  await updateDoc(userquizattempts, { attempt: at2 });
                  console.log(at2);
                }
                else {
                  at = 1;
                  console.log(at);
                  const at2 = 1;
                  await setDoc(userquizattempts, { attempt: at2 });
                  console.log(at2);
                }
              }
              else {
                console.log("Creating");
                at = 1;
                const at2 = 1;
                console.log(at2);
                await setDoc(userquizattempts, { attempt: at2 });
              }
              console.log("Value of at " + at);
              const userquizdata = collection(userquizattempts, at.toString());
              console.log(userquizdata);
              console.log(section_num);
              n = 0;
              let ques = [];
              let sec = [];
              let net_score = 0;
              console.log("Start");
              for (let i = 1; i <= section_num; i++) {
                sec[i - 1] = 0;
                const question_num = sections[i - 1].numQuestions;
                for (let j = 1; j <= question_num; j++) {
                  ques[n] = 0;
                  const options_num = questions[n].options;
                  const correct = questions[n].correct_val;
                  const posmark = questions[n].posmark;
                  const negmark = questions[n].negmark;
                  const options = document.getElementsByClassName(`${i}${j}`);
                  const len = options.length;
                  for (let k = 0; k < len; k++) {
                    if (options[k].checked) {
                      if (options[k].value == correct) {
                        net_score = net_score + posmark;
                        ques[n] = 2;
                        sec[i - 1] = sec[i - 1] + posmark;
                      }
                      else {
                        net_score = net_score - negmark;
                        ques[n] = 1;
                        sec[i - 1] = sec[i - 1] - negmark;
                      }
                    }
                  }
                  n++;
                }
              }
              console.log(ques);
              console.log(sec);
              console.log(net_score);
              const ques2 = ques;
              const sec2 = sec;
              const net_score2 = net_score;
              console.log(name2);
              const quizdatasub = {
                name: name2,
                ques_data: ques2,
                sec_marks: sec2,
                net_marks: net_score2,
                at: true,
                cat: 2,
                quizloc: quizloc
              }
              console.log(quizdatasub);
              const docref = await addDoc(userquizdata, quizdatasub);
              console.log("Document added to firestore");
              // console.log(net_score);
              const net_score3 = net_score;
              // console.log(at);
              const data = { id: user.uid, marks: net_score3 };
              const docadd = await addDoc(quizref, data);
              window.location.href = `result_quiz_custom.html?quizloc=${encodeURIComponent(quizloc)}`;
              document.getElementById("loader").style.display = "none";
              document.getElementById("loaderback").style.display = "none";
            })


            // Timer fxn
            if (time3) {
              Timer();
            }
            async function Timer() {
              const timer = document.getElementById("timer");
              let min = time3 % 60;
              let hour = Math.floor(time3 / 60);
              let sec = 0;
              let time2 = time3 * 60;
              let minhr;
              const interval = setInterval(async () => {
                if (time2 > 0) {
                  time2--;
                  sec = time2 % 60;
                  minhr = Math.floor(time2 / 60);
                  hour = Math.floor(minhr / 60);
                  min = minhr % 60;
                  timer.innerHTML = `Time Left: ${hour}:${min}:${sec}`;
                  if (time2 <= 30 && (sec % 2 == 0)) {
                    timer.style.color = "red";
                  }
                  else if (time2 <= 30 && (sec % 2 != 0)) {
                    timer.style.color = "black";
                  }
                }
                if ((time2 <= 0) || (!(window.location.pathname.includes("quiz_custom_attempt")))) {
                  clearInterval(interval);
                  timer.innerHTML = "Time Over";
                  const id = (user.uid).toString();
                  const userquizattempts = doc(db, 'userattempt', id);
                  const docSnapshot = await getDoc(userquizattempts);
                  let at;
                  if (docSnapshot.exists()) {
                    at = parseInt(await (docSnapshot.data().attempt), 10);
                    console.log("Exist")
                    if (!isNaN(at) && isFinite(at)) {
                      at = at + 1;
                      const at2 = at;
                      await updateDoc(userquizattempts, { attempt: at2 });
                      console.log(at2);
                    }
                    else {
                      at = 1;
                      console.log(at);
                      const at2 = 1;
                      await setDoc(userquizattempts, { attempt: at2 });
                      console.log(at2);
                    }
                  }
                  else {
                    console.log("Creating");
                    at = 1;
                    const at2 = 1;
                    console.log(at2);
                    await setDoc(userquizattempts, { attempt: at2 });
                  }
                  console.log("Value of at " + at);
                  const userquizdata = collection(userquizattempts, at.toString());
                  console.log(userquizdata);
                  console.log(section_num);
                  n = 0;
                  let ques = [];
                  let sec = [];
                  let net_score = 0;
                  console.log("Start");
                  for (let i = 1; i <= section_num; i++) {
                    sec[i - 1] = 0;
                    const question_num = sections[i - 1].numQuestions;
                    // console.log(question_num);
                    for (let j = 1; j <= question_num; j++) {
                      ques[n] = 0;
                      const options_num = questions[n].options;
                      const correct = questions[n].correct_val;
                      const posmark = questions[n].posmark;
                      const negmark = questions[n].negmark;
                      // console.log(correct);
                      const options = document.getElementsByClassName(`${i}${j}`);
                      const len = options.length;
                      // console.log(len);
                      // console.log(options);
                      for (let k = 0; k < len; k++) {
                        if (options[k].checked) {
                          if (options[k].value == correct) {
                            net_score = net_score + posmark;
                            ques[n] = 2;
                            sec[i - 1] = sec[i - 1] + posmark;
                          }
                          else {
                            net_score = net_score - negmark;
                            ques[n] = 1;
                            sec[i - 1] = sec[i - 1] - negmark;
                          }
                        }
                      }
                      n++;
                    }
                  }
                  console.log(ques);
                  console.log(sec);
                  console.log(net_score);
                  const ques2 = ques;
                  const sec2 = sec;
                  const net_score2 = net_score;
                  console.log(name2);
                  const quizdatasub = {
                    name: name2,
                    ques_data: ques2,
                    sec_marks: sec2,
                    net_marks: net_score2,
                    at: true,
                    cat: 2,
                    quizloc: quizloc
                  }
                  console.log(quizdatasub);
                  const docref = await addDoc(userquizdata, quizdatasub);
                  console.log("Document added to firestore");
                  const net_score3 = net_score;
                  const data = { id: user.uid, marks: net_score3 };
                  const docadd = await addDoc(quizref, data);
                  window.location.href = `result_quiz_custom.html?quizloc=${encodeURIComponent(quizloc)}`;
                }
              }, 1000)
            }
          }
        })
      }
      else {
        console.log("User signed out");
        window.location.href = 'index.html';
      }
    })
  })
}
// Custom quiz attempt ends


// Quiz Result
if (window.location.pathname.includes("quiz_result.html")) {
  document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM Loaded");
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        document.getElementById("loader").style.display = "block";
        document.getElementById("loaderback").style.display = "block";
        const urlParams = new URLSearchParams(window.location.search);
        const quizloc = urlParams.get('quizloc');
        const admid = urlParams.get('admid');
        const ctx = document.getElementById('myChart').getContext('2d');
        const ctx2 = document.getElementById('myChart2').getContext('2d')
        await quizres(admid, quizloc, user, ctx, ctx2);
        document.getElementById("loader").style.display = "none";
        document.getElementById("loaderback").style.display = "none";
        document.getElementById("lb").addEventListener("click", () => {
          window.location.href = `leaderboard.html?admid=${encodeURIComponent(admid)}&quizloc=${encodeURIComponent(quizloc)}`;
        })
        document.getElementById("ques").addEventListener("click", () => {
          window.location.href = `quiz_sol.html?admid=${encodeURIComponent(admid)}&quizloc=${encodeURIComponent(quizloc)}`;
        })
        console.log("Chart.js");
      }
      else {
        console.log("User signed out");
        window.location.href = "index.html";
      }
    })
  })
}
async function quizres(admid, quizloc, user, ctx, ctx2) {
  const colref = collection(db, 'admin', admid, quizloc);
  const docs = await getDocs(colref);
  let name2;
  let sections2;
  let questions2;
  let secnum2;
  let dis2;
  let type2;
  let icos;
  let up2;
  for (const doc of docs.docs) {
    const name = await doc.data().name;
    const sections = await doc.data().sections;
    const questions = await doc.data().questions;
    const secnum = await doc.data().section_num;
    const type = await doc.data().type;
    const dis = await doc.data().discription;
    const up = await doc.data().upvote;
    if (type) {
      name2 = name;
      type2 = type;
      dis2 = dis;
      secnum2 = secnum;
      up2 = parseInt(up, 10);
    }
    if (sections) {
      sections2 = sections;
      questions2 = questions;
    }
  }
  const ref = document.referrer;
  if (ref.includes("quiz_attempt.html")) {
    document.getElementById("uv").style.display = "block";
  }
  let click = false;
  document.getElementById("uv").addEventListener("click", async () => {
    console.log(up2);
    if (!click) {
      up2 = up2 + 1;
      const up3 = up2;
      document.getElementById("uv").innerHTML = "Quiz Upvoted!"
      document.getElementById("uv").style.color = 'goldenrod';
      for (const doc of docs.docs) {
        await updateDoc(doc.ref, { upvote: up3 });
      }
      console.log("Upvoted");
      click = true;
    }
    else {
      up2 = up2 - 1;
      document.getElementById("uv").innerHTML = "Liked the Quiz? Upvote"
      document.getElementById("uv").style.color = 'red';
      const up3 = up2;
      for (const doc of docs.docs) {
        await updateDoc(doc.ref, { upvote: up3 });
      }
      click = false;
      alert("Upvote Removed");
      console.log("Upvote Removed");
    }
  })
  let max = 0;
  let secmax = [];
  for (let i = 0; i < questions2.length; i++) {
    max = max + questions2[i].posmark;
  }
  for (let i = 0; i < sections2.length; i++) {
    secmax[i] = 0;
  }
  for (let i = 0; i < questions2.length; i++) {
    const i3 = questions2[i].i;
    secmax[(i3 - 1)] = secmax[(i3 - 1)] + questions2[i].posmark;
  }
  console.log(max);
  document.getElementById("max").innerHTML = "Maximum Marks: " + max;
  console.log(sections2);
  document.getElementById("main").innerHTML = `${name2}`;
  document.getElementById("quiz").innerHTML = `Topic: ${type2}<br><br>Total Sections: ${secnum2}<br><br>Quiz Discription: ${dis2}`;
  let a = 0;
  for (const section of sections2) {
    const n = document.createElement('div');
    n.innerHTML = `Section Number: ${section.i}<br>Section Name: ${section.sectionName}<br>Number of questions: ${section.numQuestions}<br><br>`
    document.getElementById('sec').appendChild(n);
  }
  const docref = doc(db, 'userattempt', user.uid);
  const user_doc = await getDoc(docref);
  const attempt = user_doc.data().attempt;
  const promises = [];
  for (let i = 1; i <= attempt; i++) {
    const quizcol = collection(docref, i.toString());
    const querySnapshot = query(quizcol, where('name', '==', name2));
    promises.push(getDocs(querySnapshot).then((docs2) => {
      if (!docs2.empty) {
        icos = i;
      }
    }));
  }
  await Promise.all(promises);
  const icon = icos.toString();
  console.log("Hello");
  let pos = 0, neg = 0, un = 0;
  const quizcol2 = collection(db, 'userattempt', user.uid, icon);
  const quizcoldocs = await getDocs(quizcol2);
  for (const data of quizcoldocs.docs) {
    document.getElementById("mark").innerHTML = "Total Marks Scored: " + await (data.data().net_marks);
    let n = [], a2 = 1;
    for (const question of data.data().ques_data) {
      if (question == 1) {
        n.push({ x: a2, y: -1 });
        neg++;
      }
      else if (question == 0) {
        n.push({ x: a2, y: 0 });
        un++
      }
      else {
        n.push({ x: a2, y: 1 });
        pos++;
      }
      a2++;
    }
    const posdata = [pos, neg, un];
    const posdata2 = ["Correct", "Incorrect", "Unattempted"];
    const color = ["#0000ff", "#ff0000", "000000"];
    let b = document.createElement('div');
    b.classList.add('secdata2');
    for (let i = 0; i < sections2.length; i++) {
      const a = document.createElement('div');
      a.classList.add('secdata');
      a.innerHTML = `Section: ${sections2[i].sectionName}<br>Marks obtained: ${data.data().sec_marks[i]}<br>Maximum Marks: ${secmax[i]}<br>Total Questions: ${sections2[i].numQuestions}`;
      if ((i + 1) % 3 == 0) {
        b.appendChild(a);
        document.getElementById('sec_data').appendChild(b);
        b = document.createElement('div');
        b.classList.add('secdata2');
      }
      else {
        b.appendChild(a);
      }
    }
    if (b.innerHTML != '') {
      document.getElementById('sec_data').appendChild(b);
    }
    let per = (await (data.data().net_marks) * 100) / max;
    let acc = (pos * 100) / (pos + neg);
    if (acc >= 0) {
      document.getElementById("acc").innerHTML = "Accuracy: " + acc.toFixed(2) + "%";
    }
    else {
      document.getElementById("acc").innerHTML = "Accuracy: 0%";
    }
    if (per < 0) {
      per = 0;
    }

    document.getElementById("pos").innerHTML = "Correct Responses: " + pos;
    document.getElementById("time").innerHTML = "Percentage: " + per.toFixed(2) + "%";
    document.getElementById("neg").innerHTML = "Incorrect Responses: " + neg;
    document.getElementById("ua").innerHTML = "Questions Unattempted: " + un;
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: posdata2,
        datasets: [{
          backgroundColor: color,
          data: posdata
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Your Overall Result"
        }
      }
    });
    new Chart(ctx2, {
      type: "scatter",
      data: {
        // labels: posdata2,
        datasets: [{
          pointBackgroundColor: "rgba(0,0,255,1)",
          data: n,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true, text: "1 represent correct, -1 incorrect and 0 unattempted"
        }
      }
    });
  }
}
// Quiz Result Ends


// Leaderboard
if (window.location.pathname.includes("leaderboard.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, async (user) => {
      document.getElementById("loader").style.display = "block";
      document.getElementById("loaderback").style.display = "block";
      const urlParams = new URLSearchParams(window.location.search);
      const quizloc = urlParams.get('quizloc');
      const admid = urlParams.get('admid');
      const colref = collection(db, 'admin', admid, quizloc);
      const docs = await getDocs(colref);
      let userdatas = [];
      let i = 0;
      for (const doc of docs.docs) {
        if (doc.data().id) {
          userdatas[i] = { name: doc.data().name, id: doc.data().id, marks: doc.data().marks };
          i++;
        }
      }
      userdatas.sort((a, b) => b.marks - a.marks);
      console.log(userdatas);
      let currentRank = 1;
      userdatas.forEach((participant, index) => {
        if (index > 0 && participant.marks === userdatas[index - 1].marks) {
          participant.rank = userdatas[index - 1].rank;
        } else {
          participant.rank = currentRank;
        }
        currentRank++;
      });
      console.log(userdatas);

      const leaderboard = document.getElementById("leaderboard");
      userdatas.forEach(user => {
        const row = document.createElement("tr");
        // console.log(`_${user.rank}`)
        row.classList.add(`_${user.rank}`);
        row.innerHTML = `
        <td>${user.rank}</td>
        <td>${user.name}</td>
        <td>${user.marks}</td>
      `;
        leaderboard.appendChild(row);
      });
      // }
      // else{
      //   console.log("User signed out");
      //   window.location.href="index.html";
      // }
      document.getElementById("loader").style.display = "none";
      document.getElementById("loaderback").style.display = "none";
    })
  })
}
// LeaderBoard Ends


// Custom Quiz Result
if (window.location.pathname.includes("result_quiz_custom.html")) {
  document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM Loaded");
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        document.getElementById("loader").style.display = "block";
        document.getElementById("loaderback").style.display = "block";
        const urlParams = new URLSearchParams(window.location.search);
        const quizloc = urlParams.get('quizloc');
        const ctx = document.getElementById('myChart').getContext('2d');
        const ctx2 = document.getElementById('myChart2').getContext('2d')
        await quizres_c(user.uid, quizloc, user, ctx, ctx2);
        console.log("Chart.js");
        document.getElementById("loader").style.display = "none";
        document.getElementById("loaderback").style.display = "none";
        console.log(quizloc);
        document.getElementById('ques').addEventListener('click', () => {
          window.location.href = `quiz_custom_sol.html?quizloc=${encodeURIComponent(quizloc)}`;
        })
      }
      else {
        console.log("User signed out");
        window.location.href = "index.html";
      }
    })
  })
}
async function quizres_c(user_uid, quizloc, user, ctx, ctx2) {
  const colref = collection(db, 'userquiz', user_uid, quizloc);
  const docs = await getDocs(colref);
  let name2;
  let sections2;
  let questions2;
  let secnum2;
  let dis2;
  let type2;
  let icos;
  for (const doc of docs.docs) {
    const name = await doc.data().name;
    const sections = await doc.data().sections;
    const questions = await doc.data().questions;
    const secnum = await doc.data().section_num;
    const type = await doc.data().type;
    const dis = await doc.data().discription;
    if (type) {
      name2 = name;
      type2 = type;
      dis2 = dis;
      secnum2 = secnum;
    }
    if (sections) {
      sections2 = sections;
      questions2 = questions;
    }
  }
  let max = 0;
  let secmax = [];
  for (let i = 0; i < questions2.length; i++) {
    max = max + questions2[i].posmark;
  }
  for (let i = 0; i < sections2.length; i++) {
    secmax[i] = 0;
  }
  for (let i = 0; i < questions2.length; i++) {
    const i3 = questions2[i].i;
    secmax[(i3 - 1)] = secmax[(i3 - 1)] + questions2[i].posmark;
  }
  console.log(max);
  document.getElementById("max").innerHTML = "Maximum Marks: " + max;
  console.log(sections2);
  document.getElementById("main").innerHTML = `${name2}`;
  document.getElementById("quiz").innerHTML = `Topic: ${type2}<br><br>Total Sections: ${secnum2}<br><br>Quiz Discription: ${dis2}`;
  let a = 0;
  for (const section of sections2) {
    const n = document.createElement('div');
    n.innerHTML = `Section Number: ${section.i}<br>Section Name: ${section.sectionName}<br>Number of questions: ${section.numQuestions}<br><br>`
    document.getElementById('sec').appendChild(n);
  }
  const docref = doc(db, 'userattempt', user.uid);
  const user_doc = await getDoc(docref);
  const attempt = user_doc.data().attempt;
  const promises = [];
  for (let i = 1; i <= attempt; i++) {
    const quizcol = collection(docref, i.toString());
    const querySnapshot = query(quizcol, where('name', '==', name2));
    promises.push(getDocs(querySnapshot).then((docs2) => {
      if (!docs2.empty) {
        icos = i;
      }
    }));
  }
  await Promise.all(promises);
  const icon = icos.toString();
  console.log("Hello");
  let pos = 0, neg = 0, un = 0;
  const quizcol2 = collection(db, 'userattempt', user.uid, icon);
  const quizcoldocs = await getDocs(quizcol2);
  for (const data of quizcoldocs.docs) {
    document.getElementById("mark").innerHTML = "Total Marks Scored: " + await (data.data().net_marks);
    let n = [], a2 = 1;
    for (const question of data.data().ques_data) {
      if (question == 1) {
        n.push({ x: a2, y: -1 });
        neg++;
      }
      else if (question == 0) {
        n.push({ x: a2, y: 0 });
        un++
      }
      else {
        n.push({ x: a2, y: 1 });
        pos++;
      }
      a2++;
    }
    const posdata = [pos, neg, un];
    const posdata2 = ["Correct", "Incorrect", "Unattempted"];
    const color = ["#0000ff", "#ff0000", "000000"];
    let b = document.createElement('div');
    b.classList.add('secdata2');
    for (let i = 0; i < sections2.length; i++) {
      const a = document.createElement('div');
      a.classList.add('secdata');
      a.innerHTML = `Section: ${sections2[i].sectionName}<br>Marks obtained: ${data.data().sec_marks[i]}<br>Maximum Marks: ${secmax[i]}<br>Total Questions: ${sections2[i].numQuestions}`;
      if ((i + 1) % 3 == 0) {
        b.appendChild(a);
        document.getElementById('sec_data').appendChild(b);
        b = document.createElement('div');
        b.classList.add('secdata2');
      }
      else {
        b.appendChild(a);
      }
    }
    if (b.innerHTML != '') {
      document.getElementById('sec_data').appendChild(b);
      // b.innerHTML='';
    }
    let per = (await (data.data().net_marks) * 100) / max;
    let acc = (pos * 100) / (pos + neg);
    if (acc >= 0) {
      document.getElementById("acc").innerHTML = "Accuracy: " + acc.toFixed(2) + "%";
    }
    else {
      document.getElementById("acc").innerHTML = "Accuracy: 0%";
    }
    if (per < 0) {
      per = 0;
    }

    document.getElementById("pos").innerHTML = "Correct Responses: " + pos;
    document.getElementById("time").innerHTML = "Percentage: " + per.toFixed(2) + "%";
    document.getElementById("neg").innerHTML = "Incorrect Responses: " + neg;
    document.getElementById("ua").innerHTML = "Questions Unattempted: " + un;
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: posdata2,
        datasets: [{
          backgroundColor: color,
          data: posdata
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Your Overall Result"
        }
      }
    });
    new Chart(ctx2, {
      type: "scatter",
      data: {
        // labels: posdata2,
        datasets: [{
          pointBackgroundColor: "rgba(0,0,255,1)",
          data: n,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true, text: "1 represent correct, -1 incorrect and 0 unattempted"
        }
      }
    });
  }
}
// Custom QUiz Result Ends
function sort2DArray(arr, x) {
  return arr.sort((a, b) => b[x] - a[x]);
}

// Showing Quiz History
if (window.location.pathname.includes("history.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Loaded");
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        document.getElementById("loader").style.display = "block";
        document.getElementById("loaderback").style.display = "block";
        console.log("User signed in");
        const location = doc(db, "userattempt", user.uid);
        const at = await getDoc(location);
        const attempt = await at.data().attempt;
        console.log(attempt);
        let href = [];
        for (let i = 1; i <= attempt; i++) {
          const col = collection(location, i.toString());
          const colref = await getDocs(col);
          for (let x of colref.docs) {
            const name = await x.data().name;
            console.log(name);
            const cat = x.data().cat;
            const sectionDiv = document.createElement("div");
            sectionDiv.classList.add("section-container");
            if (cat == 2) {
              sectionDiv.innerHTML = `<div class="name">Custom Quiz Name: ${name}</div>`;
              const quizloc = await x.data().quizloc;
              href[(i - 1)] = `result_quiz_custom.html?quizloc=${encodeURIComponent(quizloc)}`;
            }
            else {
              sectionDiv.innerHTML = `<div class="name">Quiz Name: ${name}</div>`;
              const quizloc = await x.data().quizloc;
              const admid = await x.data().admid;
              href[(i - 1)] = `quiz_result.html?admid=${encodeURIComponent(admid)}&quizloc=${encodeURIComponent(quizloc)}`;
            }
            const container = document.getElementById("container");
            container.appendChild(sectionDiv);
          }
        }
        for (let i = 0; i < attempt; i++) {
          document.getElementsByClassName("section-container")[i].addEventListener("click", () => {
            console.log(attempt);
            window.location.href = href[i];
          })
        }
        document.getElementById("loader").style.display = "none";
        document.getElementById("loaderback").style.display = "none";
      }
      else {
        console.log("User Signed Out")
        window.location.href = "index.html";
      }
    })
  })
}

// Quiz_sol

if (window.location.pathname.includes("quiz_sol.html")) {
  document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderback").style.display = "block";
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        let time;
        let time2;
        let name2;
        let icos;
        let question2;
        console.log("User signed in");
        const urlParams = new URLSearchParams(window.location.search);
        const admid = urlParams.get('admid');
        const quizloc = urlParams.get('quizloc');
        if (!admid) {
          window.location.href = "index.html";
        }
        const quizref = collection(db, 'admin', admid, quizloc);
        console.log("First refrence");
        const quizdata = await getDocs(quizref);
        await quizdata.forEach(async (doc2) => {
          let net_q = 0;
          const name = await doc2.data().name;
          console.log(name);
          const attempt = await doc2.data().attempt;
          const type = await doc2.data().type;
          time = await doc2.data().time;
          // const questions=await doc2.data().questions;
          if (time) {
            time2 = time;
            console.log(time2);
            name2 = name;
            const id = doc2.id;
            console.log(id);
            const docref = doc(quizref, id);
            console.log(name2);
            console.log("Attempt done");
          }
          const ansref = doc(db, 'userattempt', user.uid);
          const user_doc = await getDoc(ansref);
          const attempt_ans = await user_doc.data().attempt;
          const promises = [];
          for (let i = 1; i <= attempt_ans; i++) {
            const quizcol = collection(ansref, i.toString());
            const querySnapshot = query(quizcol, where('name', '==', name2));
            promises.push(await getDocs(querySnapshot).then((docs2) => {
              if (!docs2.empty) {
                icos = i;
              }
            }));
          }
          let ques;
          const icon = icos.toString();
          const quizcol2 = collection(db, 'userattempt', user.uid, icon);
          const quizcoldocs = await getDocs(quizcol2);
          for (const data of quizcoldocs.docs) {
            ques = data.data().ques_data;
          }
          console.log(ques);
          const hour = Math.floor(time / 60);
          const min = time % 60;
          const sections = await doc2.data().sections;
          const questions = await doc2.data().questions;
          const options = await doc2.data().option;
          if (sections) {
            console.log("Sections" + sections);
            question2 = questions;
            console.log("Q" + question2);
            console.log("O" + options);
            const section_num = sections.length;
            await sections.forEach((section) => {
              net_q = net_q + section.numQuestions;
            });
            console.log(net_q);
            let n = 0;
            let n2 = 0;
            for (let i = 1; i <= section_num; i++) {
              const question_num = sections[i - 1].numQuestions;
              for (let j = 1; j <= question_num; j++) {
                const options_num = questions[n].options;
                const quesDiv = document.createElement("div");
                const posmark = questions[n].posmark;
                const negmark = questions[n].negmark;
                quesDiv.classList.add("ques-container");
                quesDiv.innerHTML =
                  `<div class=marks><div class=marks2><div class=pos>+${posmark}</div><div class=ane>|</div><div class=neg>-${negmark}</div></div></div><div class=section>Section ${i}:   ${sections[i - 1].sectionName}</div><div class="question"><span style="font-weight:bold">${j}.</span>  ${questions[n].question}</div><br><br><br>`
                for (let k = 1; k <= options_num; k++) {
                  const optiondiv = document.createElement("div");
                  optiondiv.classList.add("option-container");
                  optiondiv.innerHTML = `<div>${options[n2].option}</div>`;
                  quesDiv.appendChild(optiondiv);
                  n2++;
                }
                const quesend = document.createElement("div");
                const cond = document.createElement("div");
                cond.classList.add("cond");
                quesend.classList.add("quesend");
                console.log(question2[n].correct_val);
                quesend.innerHTML = `<button class="but1" id="next${i}${j}">Previous</button><button class="but2" id="next${i}${j}">Next</button>`;
                if (ques[n] == 0) {
                  cond.innerHTML = `<div>Correct Option: ${question2[n].correct_val}</div><div>Status: Unattempted</div>`;
                  cond.style.textShadow = '1.7px 1.7px 5px black';
                }
                else if (ques[n] == 1) {
                  cond.innerHTML = `<div>Correct Option: ${question2[n].correct_val}</div><div>Status: Incorrect</div>`;
                  cond.style.color = 'red';
                  cond.style.textShadow = '1.7px 1.7px 5px red';
                }
                else {
                  cond.innerHTML = `<div>Correct Option: ${question2[n].correct_val}</div><div>Status: Correct</div>`;
                  cond.style.color = 'green';
                  cond.style.textShadow = '1.7px 1.7px 5px green';
                }
                quesDiv.appendChild(quesend);
                quesDiv.appendChild(cond);
                document.getElementById("m2").appendChild(quesDiv);
                n++;
              }
            }
            console.log("Hi");
            const lenbut2 = document.getElementsByClassName("but2").length;
            document.getElementsByClassName("but2")[lenbut2 - 1].style.display = "none";
            document.getElementsByClassName("ques-container")[0].style.display = "block";
            document.getElementsByClassName("but1")[0].style.display = "none";
            document.getElementById("loader").style.display = "none";
            document.getElementById("loaderback").style.display = "none";
            for (let i = 0; i < (lenbut2 - 1); i++) {
              document.getElementsByClassName("but2")[i].addEventListener("click", () => {
                document.getElementsByClassName("ques-container")[i].style.display = "none";
                document.getElementsByClassName("ques-container")[i + 1].style.display = "block";
              })
            }
            for (let i = 0; i < lenbut2; i++) {
              document.getElementsByClassName("but1")[i].addEventListener("click", () => {
                document.getElementsByClassName("ques-container")[i].style.display = "none";
                document.getElementsByClassName("ques-container")[i - 1].style.display = "block";
              })
            }
            console.log("Hello");
          }
        })
      }
      else {
        console.log("User signed out");
        window.location.href = 'index.html';
      }
    })
  })
}
// Quiz sol ends


// Custom Quiz Sol
if (window.location.pathname.includes("quiz_custom_sol.html")) {
  document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderback").style.display = "block";
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        let time;
        let time2;
        let name2;
        let icos;
        let question2;
        console.log("User signed in");
        const urlParams = new URLSearchParams(window.location.search);
        const quizloc = urlParams.get('quizloc');
        if (!quizloc) {
          window.location.href = "index.html";
        }
        const quizref = collection(db, 'userquiz', user.uid, quizloc);
        console.log("First refrence");
        const quizdata = await getDocs(quizref);
        await quizdata.forEach(async (doc2) => {
          let net_q = 0;
          const name = await doc2.data().name;
          console.log(name);
          const attempt = await doc2.data().attempt;
          const type = await doc2.data().type;
          time = await doc2.data().time;
          // const questions=await doc2.data().questions;
          if (time) {
            time2 = time;
            console.log(time2);
            name2 = name;
            const id = doc2.id;
            console.log(id);
            const docref = doc(quizref, id);
            console.log(name2);
            console.log("Attempt done");
          }
          const ansref = doc(db, 'userattempt', user.uid);
          const user_doc = await getDoc(ansref);
          const attempt_ans = await user_doc.data().attempt;
          const promises = [];
          for (let i = 1; i <= attempt_ans; i++) {
            const quizcol = collection(ansref, i.toString());
            const querySnapshot = query(quizcol, where('name', '==', name2));
            promises.push(await getDocs(querySnapshot).then((docs2) => {
              if (!docs2.empty) {
                icos = i;
              }
            }));
          }
          let ques;
          const icon = icos.toString();
          const quizcol2 = collection(db, 'userattempt', user.uid, icon);
          const quizcoldocs = await getDocs(quizcol2);
          for (const data of quizcoldocs.docs) {
            ques = data.data().ques_data;
          }
          console.log(ques);
          const hour = Math.floor(time / 60);
          const min = time % 60;
          const sections = await doc2.data().sections;
          const questions = await doc2.data().questions;
          const options = await doc2.data().option;
          if (sections) {
            console.log("Sections" + sections);
            question2 = questions;
            console.log("Q" + question2);
            console.log("O" + options);
            const section_num = sections.length;
            await sections.forEach((section) => {
              net_q = net_q + section.numQuestions;
            });
            console.log(net_q);
            let n = 0;
            let n2 = 0;
            for (let i = 1; i <= section_num; i++) {
              const question_num = sections[i - 1].numQuestions;
              for (let j = 1; j <= question_num; j++) {
                const options_num = questions[n].options;
                const quesDiv = document.createElement("div");
                const posmark = questions[n].posmark;
                const negmark = questions[n].negmark;
                quesDiv.classList.add("ques-container");
                quesDiv.innerHTML =
                  `<div class=marks><div class=marks2><div class=pos>+${posmark}</div><div class=ane>|</div><div class=neg>-${negmark}</div></div></div><div class=section>Section ${i}:   ${sections[i - 1].sectionName}</div><div class="question"><span style="font-weight:bold">${j}.</span>  ${questions[n].question}</div><br><br><br>`
                for (let k = 1; k <= options_num; k++) {
                  const optiondiv = document.createElement("div");
                  optiondiv.classList.add("option-container");
                  optiondiv.innerHTML = `<div>${options[n2].option}</div>`;
                  quesDiv.appendChild(optiondiv);
                  n2++;
                }
                const quesend = document.createElement("div");
                const cond = document.createElement("div");
                cond.classList.add("cond");
                quesend.classList.add("quesend");
                console.log(question2[n].correct_val);
                quesend.innerHTML = `<button class="but1" id="next${i}${j}">Previous</button><button class="but2" id="next${i}${j}">Next</button>`;
                if (ques[n] == 0) {
                  cond.innerHTML = `<div>Correct Option: ${question2[n].correct_val}</div><div>Status: Unattempted</div>`;
                  cond.style.textShadow = '1.7px 1.7px 5px black';
                }
                else if (ques[n] == 1) {
                  cond.innerHTML = `<div>Correct Option: ${question2[n].correct_val}</div><div>Status: Incorrect</div>`;
                  cond.style.color = 'red';
                  cond.style.textShadow = '1.7px 1.7px 5px red';
                }
                else {
                  cond.innerHTML = `<div>Correct Option: ${question2[n].correct_val}</div><div>Status: Correct</div>`;
                  cond.style.color = 'green';
                  cond.style.textShadow = '1.7px 1.7px 5px green';
                }
                quesDiv.appendChild(quesend);
                quesDiv.appendChild(cond);
                document.getElementById("m2").appendChild(quesDiv);
                n++;
              }
            }
            console.log("Hi");
            const lenbut2 = document.getElementsByClassName("but2").length;
            document.getElementsByClassName("but2")[lenbut2 - 1].style.display = "none";
            document.getElementsByClassName("ques-container")[0].style.display = "block";
            document.getElementsByClassName("but1")[0].style.display = "none";
            document.getElementById("loader").style.display = "none";
            document.getElementById("loaderback").style.display = "none";
            for (let i = 0; i < (lenbut2 - 1); i++) {
              document.getElementsByClassName("but2")[i].addEventListener("click", () => {
                document.getElementsByClassName("ques-container")[i].style.display = "none";
                document.getElementsByClassName("ques-container")[i + 1].style.display = "block";
              })
            }
            for (let i = 0; i < lenbut2; i++) {
              document.getElementsByClassName("but1")[i].addEventListener("click", () => {
                document.getElementsByClassName("ques-container")[i].style.display = "none";
                document.getElementsByClassName("ques-container")[i - 1].style.display = "block";
              })
            }
            console.log("Hello");
          }
        })
      }
      else {
        console.log("User signed out");
        // window.location.href='index.html';
      }
    })
  })
}
// Custom Quiz Sol Ends

// Profile pic in profile
if (window.location.pathname.includes("user_profile.html")) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const docref = collection(db, 'users', user.uid,'profile_pic');
      const doc = await getDocs(docref);
      if(!doc.empty){
        document.getElementById("profile_pic").style.display = "block";
        const img = doc.docs[0].data().profile_pic;
        document.getElementById("profile_pic").src=img;
        return;
      }
      document.getElementById("upload").style.display = "block";
      document.getElementById("upload").addEventListener("click", () => {
        console.log("HI");
        const img = document.getElementById("profile_pic");
        upload(img,user);
      })
    }
    else {
      window.location.href = "index.html";
    }
  })
}

function upload(img,user){
  const cloudinaryWidget = cloudinary.createUploadWidget({
    cloudName: 'dznit2e1x',
    uploadPreset: 'profile_pic'
  },
    async (error, result) => {
      if (!error && result && result.event === "success") {
        const imageurl = result.info.secure_url;
        try {
          const userdocref = collection(db, 'users', user.uid, 'profile_pic');
          await addDoc(userdocref, { profile_pic: imageurl });
          console.log("Hello");
          // img.src = imageurl;
          console.log("Profile pic uploaded");
          window.location.reload();
        }
        catch (error) {
          console.log("Error in uploading profile" + error);
        }

      }
    }
  )
  cloudinaryWidget.open();
}
