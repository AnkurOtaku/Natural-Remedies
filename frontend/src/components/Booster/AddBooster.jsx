import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { IoIosCreate } from "react-icons/io";
import { BsFillInfoCircleFill } from "react-icons/bs";
import targetArea from "../targetArea.js";
import { useRemedyStore } from "../../store/remedy.js";
import { toast } from "react-toastify";
import "../CustomToastify.css";

function AddBooster() {
  const [selectedPart, setSelectedPart] = useState("");

  const { createBooster, updateBooster, loading } = useRemedyStore();

  let navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Initialize all popovers after component mounts
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    popoverTriggerList.forEach((popoverTriggerEl) => {
      new bootstrap.Popover(popoverTriggerEl); // Initialize popover
    });

    if (location.state) {
      const booster = location.state?.booster;
      document.getElementById("name").value = booster.name;
      setSelectedPart(booster.part);
      document.getElementById("ingredients").value =
        booster.ingredients.join(", ");
      document.getElementById("expiry").value = booster.expiry;
      document.getElementById("recipe").value = booster.recipe.join("\n");
      document.getElementById("caution").value = booster.caution.join("\n");
      document.getElementById("dosage").value = booster.dosage;
      document.querySelectorAll("input[name='forKids']").forEach((input) => {
        input.checked = input.value === booster.forKids; // Compare input value to booster.forKids
      });
    }

  }, []);

  function toastAndResetValue(status, message) {
    // toast and reset values
    if (status) {
      toast.success(message, {
        className: "toastify-container",
        bodyClassName: "toastify-container",
        position: "bottom-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      });

      // Reset all fields
      document.getElementById("name").value = "";
      setSelectedPart("");
      document.getElementById("ingredients").value = "";
      document.getElementById("expiry").value = "";
      document.getElementById("recipe").value = "";
      document.getElementById("caution").value = "";
      document.getElementById("dosage").value = "";
      document
        .querySelectorAll("input[name='forKids']")
        .forEach((input) => (input.checked = false));
      navigate("/booster");
    } else {
      toast.error(message || "Something went wrong. Please try again.", {
        className: "toastify-container",
        bodyClassName: "toastify-container",
        position: "bottom-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      });
    }
  }

  function handleSubmit() {
    location.state ? handleUpdateBooster() : handleAddBooster();
  }

  const handleAddBooster = async () => {
    const newBooster = {
      name: document.getElementById("name").value,
      part: selectedPart,
      ingredients: document
        .getElementById("ingredients")
        .value.split(",")
        .map((item) => item.trim()), // Ingredients comma-separated
      expiry: document.getElementById("expiry").value,
      recipe: document
        .getElementById("recipe")
        .value.split("\n")
        .map((step) => step.trim()), // Recipe steps newline-separated
      caution: document
        .getElementById("caution")
        .value?.split("\n")
        .map((step) => step.trim()), // Caution steps newline-separated
      dosage: document.getElementById("dosage").value,
      forKids:
        document.querySelector("input[name='forKids']:checked")?.value || "",
    };

    if (newBooster.expiry < 0 || newBooster.expiry > 99) {
      toast.error("Please Enter Valid Expiry", {
        className: "toastify-container",
        bodyClassName: "toastify-container",
        position: "bottom-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      });
      return;
    }

    const { status, message } = await createBooster(newBooster); // Zustand call
    if (!status || !message) {
      toastAndResetValue(status, message);
      return;
    }

    toastAndResetValue(status, "Booster Added Succesfully");
  };

  const handleUpdateBooster = async () => {
    const updatedBooster = {
      name: document.getElementById("name").value,
      part: selectedPart,
      ingredients: document
        .getElementById("ingredients")
        .value.split(",")
        .map((item) => item.trim()), // Ingredients comma-separated
      expiry: document.getElementById("expiry").value,
      recipe: document
        .getElementById("recipe")
        .value.split("\n")
        .map((step) => step.trim()), // Recipe steps newline-separated
      caution: document
        .getElementById("caution")
        .value?.split("\n")
        .map((step) => step.trim()), // Caution steps newline-separated
      forKids:
        document.querySelector("input[name='forKids']:checked")?.value || "",
      dosage: document.getElementById("dosage").value,
    };

    if (updatedBooster.expiry < 0) {
      toast.error("Please Enter Valid Expiry", {
        className: "toastify-container",
        bodyClassName: "toastify-container",
        position: "bottom-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      });
      return;
    }

    const { status, message } = await updateBooster(
      location.state.booster._id,
      updatedBooster
    ); // Zustand call
    if (!status || !message) {
      toastAndResetValue(status, message);
      return;
    }

    toastAndResetValue(status, "Booster Updated Successfully");
  };

  return (
    <>
      <h2 className="my-4 mx-auto">
        Enter Recipe Info <IoIosCreate />
      </h2>
      <div className="row g-3">
        {/* Name */}
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">
            Helps In
          </label>
          <input
            type="text"
            className="form-control shadow-none"
            id="name"
            required
            disabled={loading}
          />
        </div>

        {/* Target Area */}
        <div className="col-md-6">
          <label htmlFor="targetArea" className="form-label">
            Target Area
          </label>
          <select
            className="form-select shadow-none"
            id="targetArea"
            required
            value={selectedPart}
            onChange={(e) => {
              setSelectedPart(e.target.value);
            }}
            disabled={loading}
          >
            <option value="">Select an area</option>
            {targetArea.map((areas, index) => (
              <option key={index} value={areas.area}>
                {areas.area}
              </option>
            ))}
          </select>
        </div>

        {/* Ingredients */}
        <div className="col-md-6">
          <label htmlFor="ingredients" className="form-label">
            Ingredients
          </label>
          <textarea
            className="form-control shadow-none"
            id="ingredients"
            placeholder={`1, 2, 3, 4 ,....`}
            rows={2}
            disabled={loading}
          ></textarea>
        </div>

        {/* Expiry */}
        <div className="col-md-4">
          <label htmlFor="expiry" className="form-label">
            Expiry (in days){" "}
            <span
              className="d-inline-block"
              tabIndex="0"
              data-bs-toggle="popover"
              data-bs-trigger="hover focus"
              data-bs-content="Value must be greater than 0. Use 99 if booster never expires."
            >
              <button
                className="btn btn-secondary p-1"
                type="button"
                disabled=""
              >
                <BsFillInfoCircleFill size={"1em"} />
              </button>
            </span>
            {/* </button> */}
          </label>
          <input
            type="number"
            className="form-control shadow-none"
            id="expiry"
            min="0"
            max="60"
            required
            disabled={loading}
          />
        </div>

        {/* Recipe */}
        <div className="col-md-12">
          <label htmlFor="recipe" className="form-label">
            Recipe
          </label>
          <textarea
            className="form-control shadow-none"
            id="recipe"
            placeholder={`add ingredient 1\nadd ingredient 2\nmix well`}
            rows={4}
            required
            disabled={loading}
          ></textarea>
        </div>

        {/* Caution */}
        <div className="col-md-12">
          <label htmlFor="caution" className="form-label">
            Caution (optional)
          </label>
          <textarea
            className="form-control shadow-none"
            id="caution"
            placeholder={`Consume it hot\nKeep it in air tight container`}
            rows={4}
            required
            disabled={loading}
          ></textarea>
        </div>

        {/* Dosage */}
        <div className="col-md-6">
          <label htmlFor="dosage" className="form-label">
            Dosage
          </label>
          <input
            type="text"
            className="form-control shadow-none"
            id="dosage"
            placeholder={`Once a week`}
            required
            disabled={loading}
          />
        </div>

        {/* For Kids */}
        <div className="col-md-6 row mt-2 align-items-center">
          <label className="form-label col m-0">For Kids under 10?</label>
          <div className="w-100 d-none d-md-block"></div>
          <div className="col">
            <input
              type="radio"
              className="btn-check"
              name="forKids"
              id="forKidsYes"
              value="yes"
              disabled={loading}
              autoComplete="off"
              defaultChecked=""
            />
            <label
              className="btn btn-outline-success me-4"
              htmlFor="forKidsYes"
            >
              Yes
            </label>
            <input
              type="radio"
              className="btn-check"
              name="forKids"
              id="forKidsNo"
              value="no"
              disabled={loading}
              autoComplete="off"
            />
            <label className="btn btn-outline-danger" htmlFor="forKidsNo">
              No
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="col-12 mb-4">
          <button
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={loading}
          >
            {location.state ? "Update" : "Add Booster"}
            {loading && (
              <span
                className="spinner-border spinner-border-sm ms-2"
                aria-hidden="true"
              ></span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default AddBooster;
