export const storyFilters = (req, res, next) => {
  const { search, status } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { story_name: { $regex: search, $options: "i" } },
      { story_email: { $regex: search, $options: "i" } },
      { story_phone: { $regex: search, $options: "i" } },
      { story_summary: { $regex: search, $options: "i" } },
      { story_body: { $regex: search, $options: "i" } },
      { story_hoa_name: { $regex: search, $options: "i" } },
      { story_city: { $regex: search, $options: "i" } },
      { story_state: { $regex: search, $options: "i" } },
      { story_issue_type: { $regex: search, $options: "i" } },
    ];
  }
  if (status) {
    query.status = status; // e.g. ?status=flagged for the moderation queue
  }

  req.story_query = query;
  next();
};
