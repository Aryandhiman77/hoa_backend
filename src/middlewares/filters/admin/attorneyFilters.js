const attorneysFilters = (req, res, next) => {
  const { search, status } = req.query;
  let query = {};
  if (status) {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { attorney_name: { $regex: search, $options: "i" } },
      { attorney_email: { $regex: search, $options: "i" } },
      { attorney_firm: { $regex: search, $options: "i" } },
      { attorney_summary: { $regex: search, $options: "i" } },
      { attorney_bio: { $regex: search, $options: "i" } },
      { attorney_city: { $regex: search, $options: "i" } },
      { attorney_state: { $regex: search, $options: "i" } },
      { attorney_county: { $regex: search, $options: "i" } },
      { attorney_practice_areas: { $regex: search, $options: "i" } },
    ];
  }
  req.attorney_query = query;
  next();
};

export default attorneysFilters;
