import React, { useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(authService);
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer> & copy; Leeon {new Date().getFullYear()} </footer>
    </>
  );
}

export default App;
