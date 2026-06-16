export const resourceFilters = (req, res, next) => {
  const { keyword, category } = req.query;

  const query = { status: "published" };
  if (category) {
    query.category = category;
  }
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { slug: { $regex: keyword, $options: "i" } },
      { summary: { $regex: keyword, $options: "i" } },
    ];
  }
  req.resource_filters = query;

  next();
};
