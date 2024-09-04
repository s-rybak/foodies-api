import listAreas from "../services/areasServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const getAllAreas = async (req, res) => {
  const result = await listAreas();
  res.json(result);
};

export default ctrlWrapper(getAllAreas);
