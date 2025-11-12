// src/Components/CategoryForm/CategoryForm.jsx
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../Context/AppContext"; // adjust path if needed
import { addCategory } from "../../Service/CategoryService"; // adjust path if needed
import toast from "react-hot-toast";
import { assets } from "../../assets/assets.js";


const CategoryForms = () => {
    const { setCategories, categories } = useContext(AppContext);

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null); // null is clearer than false

    const [data, setData] = useState({
        name: "",
        description: "",
        bgColor: "#2c2c2c",
    });

    useEffect(() => {
        console.log(data);
    }, [data]);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    // note: async because we await addCategory
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!image) {
            toast.error("Select image for category");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("bgColor", data.bgColor);
        formData.append("image", image);


        try {
            const response = await addCategory(formData); // make sure service function exists
            if (response.status === 201 || response.status === 200) {
                // adjust according to your API
                setCategories([...categories, response.data]);
                toast.success("Category added successfully");
                setData({
                    name: "",
                    description: "",
                    bgColor: "#2c2c2c",
                });
                setImage(null);
            } else {
                toast.error("Unexpected response from server");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error adding category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-2 mt-2">
            <div className="row">
                <div className="card col-md-12 form-container">
                    <div className="card-body">
                        <form onSubmit={onSubmitHandler}>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label" style={{
                                    cursor: "pointer",
                                    
                                }}>
                                    <img
                                        src={image ? URL.createObjectURL(image) : assets.upload}
                                        alt="upload"
                                        width={48}
                                    />
                                </label>
                                {/* id matches htmlFor above */}
                                <input
                                    type="file"
                                    name="image"
                                    id="image"
                                    className="form-control"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="form-control"
                                    placeholder="Category Name"
                                    onChange={onChangeHandler}
                                    value={data.name}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">
                                    Description
                                </label>
                                <textarea
                                    rows="5"
                                    name="description"
                                    id="description"
                                    className="form-control"
                                    placeholder="Write content here..."
                                    onChange={onChangeHandler}
                                    value={data.description}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="bgcolor" className="form-label">
                                    Background color
                                </label>
                                <br />
                                <input
                                    type="color"
                                    name="bgColor"
                                    id="bgcolor"
                                    onChange={onChangeHandler}
                                    value={data.bgColor}
                                />
                            </div>

                            <button type="submit" disabled={loading} className="btn btn-warning w-100">
                                {loading ? "Loading..." : "Submit"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryForms;
