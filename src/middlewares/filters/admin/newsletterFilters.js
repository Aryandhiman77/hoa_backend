const newsletterFilters = (req, res, next) => {
  const { search, status } = req.query;
  let query = {};
  const normalizedStatus = status?.toLowerCase()?.trim();
  const statuses = ["subscribed", "unsubscribed"];
  if (statuses.includes(normalizedStatus)) {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { email: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } },
    ];
  }
  req.newsletter_filters = query;
  next();
};

export default newsletterFilters;
