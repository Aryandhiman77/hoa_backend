export const blogSearchFilter = (req, res, next) => {
  const { search } = req.query;

  const query = {
    status: "published",
  };

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
  req.blog_search_query = query;

  next();
};
