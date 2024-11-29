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
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);

    // setup a messages sql table
    // id, message, step, context
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        message TEXT,
        step TEXT,
        context TEXT
      )
    `);

    this.ctx.blockConcurrencyWhile(async () => {
      // wait for 10 seconds
      if (!this.ctx.storage.getAlarm()) {
        // this.ctx.storage.setAlarm();
        // find the time for sunday night
      }
    });
  }

  onAlarm() {
    // you will drain to S3 or whatever
  }

  onConnect(connection: Connection<unknown>) {
    console.log("connected", this.name);
    connection.send(
      JSON.stringify({ type: "welcome", message: "Welcome to the party!" })
    );
  }
  onMessage(connection: Connection<unknown>, message: WSMessage) {
    console.log("message", message);
  }
  onRequest(request: Request) {
    return new Response("Hello, World!");
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
