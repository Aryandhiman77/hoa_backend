const homeOwnerAttorneysFilters = (req, _, next) => {
  const { state, city, county, practice_area, keyword } = req.query;
  let query = { status: "published", isPublished: true };
  if (state) {
    query.attorney_state = state.toLowerCase();
  }
  if (city) {
    query.attorney_city = city.toLowerCase();
  }
  if (county) {
    query.attorney_county = county.toLowerCase();
  }
  if (practice_area) {
    if (practiceArea) {
      query.attorney_practice_areas = {
        $in: Array.isArray(practiceArea)
          ? practiceArea.toLowerCase()
          : [practiceArea.toLowerCase()],
      };
    }
  }
  if (keyword) {
    query.$or = [
      { attorney_name: { $regex: keyword.toLowerCase(), $options: "i" } },
      { attorney_firm: { $regex: keyword.toLowerCase(), $options: "i" } },
      { attorney_summary: { $regex: keyword.toLowerCase(), $options: "i" } },
      { attorney_bio: { $regex: keyword.toLowerCase(), $options: "i" } },
      { attorney_city: { $regex: keyword.toLowerCase(), $options: "i" } },
      { attorney_state: { $regex: keyword.toLowerCase(), $options: "i" } },
      { attorney_county: { $regex: keyword.toLowerCase(), $options: "i" } },
      {
        attorney_practice_areas: {
          $regex: keyword.toLowerCase(),
          $options: "i",
        },
      },
    ];
  }
  req.hoa_query = query;
  next();
};

export default homeOwnerAttorneysFilters;
