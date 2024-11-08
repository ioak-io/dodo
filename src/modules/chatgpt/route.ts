import { authorize } from "../../middlewares";
import { processChatGpt } from "./service";

module.exports = function (router: any) {
  router.post("/chatgpt/:uri*", authorize, processChatGpt);
};
