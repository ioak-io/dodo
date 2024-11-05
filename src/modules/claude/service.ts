import * as Helper from "./helper";

export const processClaude = async (req: any, res: any) => {
  // const stream = req.query.stream;
  const uri = `${req.params.uri}${req.params[0]}`;
  const { data, headers } = req;
  const out: any = await Helper.processClaude(uri, req.body, headers?.authorization, res);
  // res.status(out.code);
  // res.send(out);
  // res.end();
};
