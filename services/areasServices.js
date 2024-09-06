import Area from '../db/models/Area.js';

const listAreas = ( pagination = {}) => {
  const { page = 1, limit = 2 } = pagination;
  const normalizedLimit = Number(limit);
  const offset = (Number(page) - 1) * normalizedLimit;
  return Area.findAll({ offset, limit: normalizedLimit });
};

export default listAreas;
