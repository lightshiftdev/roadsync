import { App, Session } from "@croquet/croquet";
import { World } from "./World";
import "./style.css";
import SimModel from "./model/SimModel";

const CROQUET_API_KEY = import.meta.env.VITE_CROQUET_API_KEY;
const CROQUET_APP_ID = import.meta.env.VITE_CROQUET_APP_ID;
const CROQUET_APP_NAME = import.meta.env.VITE_CROQUET_APP_NAME;

App.makeWidgetDock(); // shows QR code

Session.join({
  apiKey: CROQUET_API_KEY, // get your own from croquet.io/keys
  appId: CROQUET_APP_ID,
  name: App.autoSession(CROQUET_APP_NAME),
  password: App.autoPassword(),
  model: SimModel,
  view: World,
});
