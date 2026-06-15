const faqFilters = (req, res, next) => {
  const { search } = req.query;
  let query = { publish_status: "published" };
  if (search) {
    query.$or = [
      { question: { $regex: search, $options: "i" } },
      { answer: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }
  req.faq_query = query;
  next();
};

export default faqFilters;
