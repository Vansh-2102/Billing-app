import React, { useState, useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { addItem } from "../../Service/ItemService";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets.js";

const ItemForm = () => {
    const { categories, setItems, items } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        categoryId: "",
    });

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!image) {
            toast.error("Select image for item");
            return;
        }

        if (!data.categoryId) {
            toast.error("Select a category");
            return;
        }

        if (!data.name || !data.price) {
            toast.error("Name and price are required");
            return;
        }

        setLoading(true);

        try {
            const itemData = {
                name: data.name,
                description: data.description || "",
                price: parseFloat(data.price),
                categoryId: data.categoryId,
            };

            const response = await addItem(itemData, image);
            if (response.status === 201 || response.status === 200) {
                if (setItems) {
                    setItems([...items, response.data]);
                }
                toast.success("Item added successfully");
                setData({
                    name: "",
                    description: "",
                    price: "",
                    categoryId: "",
                });
                setImage(null);
            } else {
                toast.error("Unexpected response from server");
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.message || "Error adding item";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="item-form-container" style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
            <div className="mx-2 mt-2">
                <div className="row">
                    <div className="card col-md-8 form-container">
                        <div className="card-body">
                            <form onSubmit={onSubmitHandler}>
                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label" style={{ cursor: "pointer" }}>
                                        <img
                                            src={image ? URL.createObjectURL(image) : assets.upload}
                                            alt="upload"
                                            width={48}
                                        />
                                    </label>
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
                                        placeholder="Item Name"
                                        onChange={onChangeHandler}
                                        value={data.name}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="category">
                                        Category
                                    </label>
                                    <select
                                        name="categoryId"
                                        id="category"
                                        className="form-control"
                                        onChange={onChangeHandler}
                                        value={data.categoryId}
                                        required
                                    >
                                        <option value="">--SELECT CATEGORY--</option>
                                        {categories.map((category) => (
                                            <option key={category.categoryId} value={category.categoryId} required>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        className="form-control"
                                        placeholder="₹200.00"
                                        step="0.01"
                                        min="0"
                                        onChange={onChangeHandler}
                                        value={data.price}
                                        required
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
                                        placeholder="Write content here...."
                                        onChange={onChangeHandler}
                                        value={data.description}
                                    ></textarea>
                                </div>

                                <button type="submit" disabled={loading} className="btn btn-warning w-100">
                                    {loading ? "Loading..." : "Save"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemForm;
