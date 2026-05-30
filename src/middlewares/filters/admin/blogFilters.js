const blogFilters = (req, res, next) => {
  const { search, status } = req.query;
  let query = {};
  if (status) {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { body: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
      { status: { $regex: search, $options: "i" } },
      { seo_title: { $regex: search, $options: "i" } },
      { meta_description: { $regex: search, $options: "i" } },
    ];
  }
  req.blog_query = query;
  next();
};

export default faqFilters;
