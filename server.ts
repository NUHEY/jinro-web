import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import { attachGameServer } from "./src/server/gameServer";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    path: "/socket.io",
  });

  attachGameServer(io);

  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`> 人狼DX オンライン版が起動しました: http://localhost:${port}`);
    console.log(`> 同じWi-Fi内のスマホからは http://<このPCのIPアドレス>:${port} でアクセスできます`);
  });
});
