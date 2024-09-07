import ctrlWrapper from "../decorators/ctrlWrapper.js";
import listAreas from "../services/areasServices.js";

const getAllAreas = async (req, res) => {
  const result = await listAreas();
  res.json(result);
};

export default ctrlWrapper(getAllAreas);
