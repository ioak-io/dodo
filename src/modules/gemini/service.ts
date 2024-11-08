import * as Helper from "./helper";

export const processGemini = async (req: any, res: any) => {
  const uri = `${req.params.uri}${req.params[0]}`;
  const { data, headers } = req;
  const out: any = await Helper.processGemini(uri, req.body, headers?.authorization, res);
};
