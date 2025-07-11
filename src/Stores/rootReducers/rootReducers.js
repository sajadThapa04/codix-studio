// src/store/rootReducer.js
import { combineReducers } from "redux";
import clientReducers from "../Slices/client.slices";
import adminReducers from "../Slices/admin.slices";
import blogReducers from "../Slices/blog.slices";
import serviceReducers from "../Slices/service.slices";
const rootReducer = combineReducers({
    client: clientReducers,
    admin: adminReducers,
    blog: blogReducers,
    service: serviceReducers
});

export default rootReducer;