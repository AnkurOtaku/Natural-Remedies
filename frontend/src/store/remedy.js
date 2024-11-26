import { create } from "zustand";

export const useRemedyStore = create((set) => ({
  remedies: [], filter: '',
  setRemedies: (remedies) => set({ remedies }),
  setFilter: (filter) => set({filter}),
  createRemedy: async (newRemedy) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/remedies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRemedy),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); // Fallback for non-JSON responses
        return {
          status: false,
          message: errorData.message || "Request failed",
        };
      }

      const data = await res.json();
      set((state) => ({ remedies: [...state.remedies, data.data] }));
      return { status: true, message: "Remedy added successfully" };
    } catch (error) {
      console.error("Error creating remedy:", error);
      return { status: false, message: "Network error or server issue" };
    }
  },
  fetchRemedies: async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/remedies`);
      if (!res.ok) {
        console.error("Failed to fetch remedies");
        return;
      }

      const data = await res.json();
      set({ remedies: data.data }); // Update the correct state
    } catch (error) {
      console.error("Error fetching remedies:", error);
    }
  },
  deleteRemedy: async (rid) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/remedies/${rid}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!data.status) return { status: false, message: data.message };

      // update the ui immediately, without needing a refresh
      set((state) => ({
        remedies: state.remedies.filter((remedy) => remedy._id !== rid),
      }));      
      return { status: true, message: data.message };
    } catch (error) {
      console.error("Error deleting remedies:", error);
    }
  },
  updateRemedy: async (rid, updatedRemedy) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/remedies/${rid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedRemedy),
      });
      const data = await res.json();
      if(!data.status) return {status: false, message: "Unable to update at the moment"}
      
      
      // update the ui immediately, without needing a refresh
      // set(state=>({
      //   remedies: state.remedies.map((remedy)=>{remedy._id===rid? data.data : remedy})
      // }));
      return { status: true, message: "Remedy updated successfully" };
    } catch (error) {
      console.error("Error updating remedies:", error);
    }
  }
}));
