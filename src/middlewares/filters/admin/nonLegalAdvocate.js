export const nonLegalAdvocateFilters = (req, res, next) => {
  const { search, status } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { adv_name: { $regex: search, $options: "i" } },
      { adv_email: { $regex: search, $options: "i" } },
      { adv_phone: { $regex: search, $options: "i" } },
      { adv_state: { $regex: search, $options: "i" } },
      { adv_hoa_name: { $regex: search, $options: "i" } },
      { adv_issue_summary: { $regex: search, $options: "i" } },
      { adv_estimated_damages: { $regex: search, $options: "i" } },
    ];
  }
  if (status) {
    query.status = status;
  }

  req.non_legal_advocate_query = query;
  next();
};
