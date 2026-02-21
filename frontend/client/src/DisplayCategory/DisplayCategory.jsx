import "./DisplayCategory.css";
import Category from "../Components/Category/Category.jsx";
import { assets } from "../assets/assets";

const DisplayCategory = ({
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  return (
    <div>
      {/* ALL ITEMS */}
      <div className="row g-3" style={{ width: "100%", margin: 0 }}>
        <div
          key="all"
          className="col-md-3 col-sm-6"
          style={{ padding: "0 10px" }}
        >
          <Category
            categoryName="ALL Items"
            imgUrl="https://cdn-icons-png.flaticon.com/512/1042/1042336.png"
            numberOfItems={categories.reduce(
              (acc, cat) => acc + (cat.items?.length || 0),
              0
            )}
            bgColor="#6c757d"
            isSelected={selectedCategory === ""}
            onClick={() => setSelectedCategory("")}
          />
        </div>
      </div>

      {/* CATEGORY LIST */}
      <div className="row g-3" style={{ width: "100%", margin: 0 }}>
        {categories.map((category) => (
          <div
            key={category.categoryId}
            className="col-md-3 col-sm-6"
            style={{ padding: "0 10px" }}
          >
            <Category
              categoryName={category.categoryName || category.name}
              imgUrl={category.imgUrl || category.imageUrl}
              numberOfItems={
                category.numberOfItems ||
                category.itemsCount ||
                category.totalItems ||
                0
              }
              bgColor={category.bgColor || "#3b82f6"}
              isSelected={selectedCategory === category.categoryId}
              onClick={() =>
                setSelectedCategory(category.categoryId)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayCategory;