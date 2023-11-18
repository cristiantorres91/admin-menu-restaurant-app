import axios from "axios";

const uploadImage = async (file) => {
  if (!file) return;
  try {
    const formData = new FormData();
    formData.append("upload_preset", "app-restaurant");
    formData.append("file", file);
    const url = process.env.API_CLOUDINARY;
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    const { data } = await axios.post(url, formData, config);

    return data.secure_url;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default uploadImage;
