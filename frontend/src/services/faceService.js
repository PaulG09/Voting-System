import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

const enrollFace = async (imageFile, reference) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("reference", reference);

    const response = await axios.post(`${API_BASE_URL}/api/face/enroll`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error enrolling face:", error);
    throw error;
  }
};

const verifyFace = async (imageFile, reference) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("reference", reference);

    const response = await axios.post(`${API_BASE_URL}/api/face/verify`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying face:", error);
    throw error;
  }
};

const faceApi = {
  enrollFace,
  verifyFace,
};

export default faceApi;