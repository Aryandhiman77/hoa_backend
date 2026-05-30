const faqFilters = (req, res, next) => {
  const { search, status } = req.query;
  let query = {};
  if (publish_status) {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { question: { $regex: search, $options: "i" } },
      { answer: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { publish_status: { $regex: search, $options: "i" } },
    ];
  }
  req.faq_query = query;
  next();
};

export default faqFilters;
