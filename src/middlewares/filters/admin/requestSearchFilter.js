const requestSearchFilter = (req, res, next) => {
  const { search } = req.query;
  let query = {};
  if (search) {
    query.$or = [
      { status: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search.toLowerCase(), $options: "i" } },
      { caseId: { $regex: search.toUpperCase(), $options: "i" } },
    ];
  }
  req.request_search = query;
  next();
};

export default requestSearchFilter;
