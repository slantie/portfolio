import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ResumePage = () => {
  useEffect(() => {
    // Open the resume link in a new tab
    window.open(
      "https://drive.google.com/file/d/1pzHUDvUTq3bWBnwSoHo5F_1At9rhIuqs/view?usp=sharing",
      "_blank",
      "noopener,noreferrer"
    );
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Opening Resume...</h1>
        <p>
          If it doesn't open automatically, please{" "}
          <a
            href="https://drive.google.com/file/d/1pzHUDvUTq3bWBnwSoHo5F_1At9rhIuqs/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResumePage;
