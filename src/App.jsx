import Navbar from "./components/layout/Navbar";
import "./App.css";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);
function App() {
  return <Navbar />;
}

export default App;
