import { useEffect } from "react";
import { testGateway } from "./api/test";

function App() {
  useEffect(() => {
    testGateway();
  }, []);

  return (
    <div>
      <h1>HelpDesk</h1>
      <p>Testando comunicação com o API Gateway...</p>
    </div>
  );
}

export default App;