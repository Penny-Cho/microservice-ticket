import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response?.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger mt-4">
          {err.response?.data.errors.map((err) => (
            <p className="text-error" key={err.field}>
              {err.message}
            </p>
          ))}
        </div>
      );
    }
  };

  return { doRequest, errors };
};
