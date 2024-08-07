import React from "react";
import { useFormik } from "formik";
import "./App.css"; // Import the CSS file

const itemsApiResponse = [
  { id: 1, name: "Jasinthe Bracelet", category: { id: 1, name: "Bracelets" } },
  { id: 2, name: "Inspire Bracelet", category: { id: 1, name: "Bracelets" } },
  {
    id: 3,
    name: "Zero amount item with questions",
    category: { id: 2, name: "Recurring" },
  },
  {
    id: 4,
    name: "Normal item with questions",
    category: { id: 2, name: "Recurring" },
  },
  { id: 5, name: "Normal item", category: { id: 2, name: "Recurring" } },
];

const App = () => {
  const formik = useFormik({
    initialValues: {
      applied_to: "some",
      applicable_items: [],
    },
    onSubmit: (values) => {
      console.log("Applied to:", values.applied_to);
      console.log("Selected Items:", values.applicable_items);
    },
  });

  const handleCategoryChange = (categoryId, checked) => {
    const itemsInCategory = itemsApiResponse.filter(
      (item) => item.category.id === categoryId
    );
    let newApplicableItems = [...formik.values.applicable_items];

    itemsInCategory.forEach((item) => {
      if (checked && !newApplicableItems.includes(item.id)) {
        newApplicableItems.push(item.id);
      } else if (!checked && newApplicableItems.includes(item.id)) {
        newApplicableItems = newApplicableItems.filter((id) => id !== item.id);
      }
    });

    formik.setFieldValue("applicable_items", newApplicableItems);
  };

  const handleItemChange = (itemId, checked) => {
    let newApplicableItems = [...formik.values.applicable_items];

    if (checked && !newApplicableItems.includes(itemId)) {
      newApplicableItems.push(itemId);
    } else if (!checked && newApplicableItems.includes(itemId)) {
      newApplicableItems = newApplicableItems.filter((id) => id !== itemId);
    }

    formik.setFieldValue("applicable_items", newApplicableItems);
  };

  const groupedItems = itemsApiResponse.reduce((acc, item) => {
    const categoryName = item.category.name;
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(item);
    return acc;
  }, {});

  return (
    <form className="form-container" onSubmit={formik.handleSubmit}>
      <div className="radio-group">
        <label className="custom-radio">
          <input
            type="radio"
            name="applied_to"
            value="some"
            checked={formik.values.applied_to === "some"}
            onChange={formik.handleChange}
          />
          <span>Apply to specific item</span>
        </label>
        <br/>
        <label className="custom-radio">
          <input
            type="radio"
            name="applied_to"
            value="all"
            checked={formik.values.applied_to === "all"}
            onChange={() => {
              formik.setFieldValue("applied_to", "all");
              formik.setFieldValue(
                "applicable_items",
                itemsApiResponse.map((item) => item.id)
              );
            }}
          />
          <span>Apply to all items in collection</span>
        </label>
      </div>

      {Object.keys(groupedItems).map((category) => (
        <div key={category} className="category-container">
          <label>
            <input
              type="checkbox"
              checked={groupedItems[category].every((item) =>
                formik.values.applicable_items.includes(item.id)
              )}
              onChange={(e) =>
                handleCategoryChange(
                  groupedItems[category][0].category.id,
                  e.target.checked
                )
              }
            />
            <span className="category-label">{category}</span>
          </label>

          <div className="item-list">
            {groupedItems[category].map((item) => (
              <label key={item.id} className="item-label">
                <input
                  type="checkbox"
                  checked={formik.values.applicable_items.includes(item.id)}
                  onChange={(e) => handleItemChange(item.id, e.target.checked)}
                />
                {item.name}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button type="submit" className="submit-button">
        Apply to {formik.values.applied_to === "all" ? "all" : "selected"} items
      </button>
    </form>
  );
};

export default App;
