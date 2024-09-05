import Area from "../db/models/Area.js";

const listAreas = () => {
  return Area.findAll();
};

export default listAreas;
