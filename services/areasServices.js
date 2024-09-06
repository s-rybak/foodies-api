import Area from '../db/models/Area.js';

const listAreas = (query = {},  pagination = {}) => {
  const { page = 1, limit = 10 } = pagination;
  const normalizedLimit = Number(limit);
  const offset = (Number(page) - 1) * normalizedLimit;
  return Area.findAll({ where: query, offset, limit: normalizedLimit });
};

export default listAreas;
