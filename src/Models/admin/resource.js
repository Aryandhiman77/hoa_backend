// title, slug, summary, body, state, city, issue tags, uploads, featured flag, status, AI fields

import mongoose from "mongoose";

const resouceSchema = new mongoose.Schema({
    
});

const Resource = mongoose.model("Resource", resouceSchema);
export default Resource;
