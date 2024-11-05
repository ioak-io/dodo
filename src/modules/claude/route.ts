import { authorize } from "../../middlewares";
import { processClaude } from "./service";

module.exports = function (router: any) {
  router.post("/claude/:uri*", authorize, processClaude);
};
