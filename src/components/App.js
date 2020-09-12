import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "firebaseConfig";

function App() {
  // if user is logged in? true
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // if firebase is initialized? true
  const [init, setInit] = useState(false);
  // current user
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        "Initializing..."
      )}
      <footer> & copy; Leeon {new Date().getFullYear()} </footer>
    </>
  );
}

export default App;
