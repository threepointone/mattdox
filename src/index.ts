import {
  Connection,
  Server,
  WSMessage,
  routePartykitRequest,
} from "partyserver";

type Env = {
  Session: DurableObjectNamespace<Session>;
};

export class Session extends Server<Env> {
  onConnect(connection: Connection<unknown>) {
    console.log("connected", this.name);
    connection.send(
      JSON.stringify({ type: "welcome", message: "Welcome to the party!" })
    );
  }
  onMessage(connection: Connection<unknown>, message: WSMessage) {
    console.log("message", message);
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return (
      (await routePartykitRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
