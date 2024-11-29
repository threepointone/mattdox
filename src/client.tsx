import { createRoot } from "react-dom/client";
import { usePartySocket } from "partysocket/react";
import { useEffect } from "react";

function App() {
  const socket = usePartySocket({
    room: "some-id",
    party: "session",
    onMessage(message) {
      console.log("message", message.data);
    },
  });

  useEffect(() => {
    socket.send(
      JSON.stringify({ type: "hello", message: "Hello from the client!" })
    );
  }, []);
  return <h1>Hello Matt!</h1>;
}

createRoot(document.getElementById("root")!).render(<App />);
