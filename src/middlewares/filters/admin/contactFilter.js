export const contactFilters = (req, res, next) => {
  const { search, status } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { contact_name: { $regex: search, $options: "i" } },
      { story_email: { $regex: search, $options: "i" } },
      { contact_phone: { $regex: search, $options: "i" } },
      { contact_subject: { $regex: search, $options: "i" } },
      { contact_message: { $regex: search, $options: "i" } },
    ];
  }
  if (status) {
    query.status = status;
  }

  req.contact_query = query;
  next();
};
