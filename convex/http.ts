import { auth } from "./auth";
import Router from "./router";

const http = Router;

auth.addHttpRoutes(http);

export default http;
