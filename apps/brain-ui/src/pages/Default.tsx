import { useEffect, useState } from "react";
import reactLogo from "./../assets/react.svg";
import viteLogo from "/vite.svg";
import vlab from "/vlab.svg";
import { useNavigate } from "react-router-dom";
import { useAppConfig } from "../context/AppConfigContext";

export function Default() {
  const [count, setCount] = useState(0);
  const [srvMessage, setSrvMessage] = useState<{
    message: string;
    timeStamp: string;
  }>({ message: "", timeStamp: "" });

  const navigate = useNavigate();
  const { vlApiUrl } = useAppConfig();

  // Fetch all knowledge topics
  useEffect(() => {
    fetch(new URL("/", vlApiUrl))
      .then((res) => res.json())
      .then(setSrvMessage);
  }, [vlApiUrl]);

  return (
    <>
      <div>
        <a href="/">
          <img src={vlab} className="logo react" alt="React logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Voyage Lab + Vite + React</h1>
      <div className="card">
        <button onClick={() => navigate("/brain")}>Goto Brain</button>
        <p>Brain</p>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p className="api-status">
          <span className="status-icon">✓</span> {srvMessage.message}
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
