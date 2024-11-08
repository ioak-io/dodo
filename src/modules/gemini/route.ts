import { authorize } from "../../middlewares";
import { processGemini } from "./service";

module.exports = function (router: any) {
  router.post("/gemini/:uri*",authorize, processGemini);
};
