// src/store/rootReducer.js
import { combineReducers } from "redux";
import clientReducers from "../Slices/client.slices";
import adminReducers from "../Slices/admin.slices";
import blogReducers from "../Slices/blog.slices";

const rootReducer = combineReducers({
    client: clientReducers,
    admin: adminReducers,
    blog: blogReducers
});

export default rootReducer;