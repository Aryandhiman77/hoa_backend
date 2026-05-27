export const storyFilters = (req, res, next) => {
  const { state, category, tag, keyword } = req.query;

  const query = {
    status: "published",
    isPublished: true,
  };

  if (state) {
    query.story_state = state;
  }

  // category/tag both point to story_issue_type
  const issueTypes = category || tag;

  if (issueTypes) {
    query.story_issue_type = {
      $in: Array.isArray(issueTypes) ? issueTypes : [issueTypes],
    };
  }

  if (keyword) {
    query.$or = [
      { story_name: { $regex: keyword, $options: "i" } },
      { story_summary: { $regex: keyword, $options: "i" } },
      { story_body: { $regex: keyword, $options: "i" } },
      { story_hoa_name: { $regex: keyword, $options: "i" } },
      { story_city: { $regex: keyword, $options: "i" } },
      { story_state: { $regex: keyword, $options: "i" } },
      { story_issue_type: { $regex: keyword, $options: "i" } },
    ];
  }

  req.story_query = query;
  next();
};
