const sortingFilters = (req, res, next) => {
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
  const sortBy = { createdAt: sortOrder };
  req.sorting_query = sortBy;
  next();
};

export default sortingFilters;
