const homeOwnerAttorneysFilters = () => {
  const { state, city, country, practice_area, keyword } = req.query;
  let query = { status: "approved", isPublished: true };
  if (state) {
    query.attorney_state = state;
  }
  if (city) {
    query.attorney_city = city;
  }
  if (country) {
    query.attorney_county = country;
  }
  if (practice_area) {
    if (practiceArea) {
      query.attorney_practice_areas = {
        $in: Array.isArray(practiceArea) ? practiceArea : [practiceArea],
      };
    }
  }
  if (keyword) {
    query.$or = [
      { attorney_name: { $regex: keyword, $options: "i" } },
      { attorney_firm: { $regex: keyword, $options: "i" } },
      { attorney_summary: { $regex: keyword, $options: "i" } },
      { attorney_bio: { $regex: keyword, $options: "i" } },
      { attorney_city: { $regex: keyword, $options: "i" } },
      { attorney_state: { $regex: keyword, $options: "i" } },
      { attorney_county: { $regex: keyword, $options: "i" } },
      { attorney_practice_areas: { $regex: keyword, $options: "i" } },
    ];
  }
  req.hoa_query = query;
  next();
};

export default homeOwnerAttorneysFilters;
