const express = require("express");
const router = express.Router();

router.get("/", (_: any, res: any) => {
  res.send("v1.0.0");
  res.end();
});

require("./modules/claude/route")(router);
require("./modules/chatgpt/route")(router);
require("./modules/gemini/route")(router);
module.exports = router;
