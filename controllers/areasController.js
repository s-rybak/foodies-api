import listAreas from "../services/areasServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const getAllAreas = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await listAreas({}, { page, limit });
  res.json(result);
};

export default ctrlWrapper(getAllAreas);
