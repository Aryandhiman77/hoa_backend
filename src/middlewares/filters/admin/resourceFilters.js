export const resourceFilters = (req, res, next) => {
  const { search, status } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
      { summary: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { seo_title: { $regex: search, $options: "i" } },
      { meta_description: { $regex: search, $options: "i" } },
    ];
  }
  req.resource_filters = query;

  next();
};
