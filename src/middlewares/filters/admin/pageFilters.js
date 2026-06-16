export const pageFilters = (req, res, next) => {
  const { search, status } = req.query;

  const query = {};
  if (status) {
    query.publish_status = status;
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
      { hero_title: { $regex: search, $options: "i" } },
      { hero_body: { $regex: search, $options: "i" } },
    ];
  }
  req.page_filters = query;

  next();
};
