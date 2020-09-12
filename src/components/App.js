import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "firebaseConfig";

function App() {
  // if firebase is initialized? true
  const [init, setInit] = useState(false);
  // current user
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        "Initializing..."
      )}
      <footer> & copy; Leeon {new Date().getFullYear()} </footer>
    </>
  );
}

export default App;
