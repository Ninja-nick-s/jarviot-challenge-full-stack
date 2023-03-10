import React, { useEffect} from "react";
import GoogleDrive from "../apis/GoogleDrive";
import { useNavigate } from "react-router-dom";
import google_drive from "../images/google drive.jpg";

export const Mainpage = () => {
  let navigate = useNavigate();
  const Authorize = async () => {
    const res = await GoogleDrive.get("/auth");
    const url = res.data.url;
    if (res.data.authed === true) {
      navigate("/report");
    } else {
      window.open(url, "_self");
    }
  };
  async function AuthenticateStatus() {
    const res = await GoogleDrive.get("/auth");
    if (res.data.authed === true) {
      navigate("/report");
    }
  }
  useEffect(() => {
    AuthenticateStatus();
  }, []);

  return (
    <div className='mainpage'>
      <h1>Google drive risk Report</h1>
      <button className="mainpage-button" onClick={Authorize}>
        Scan Google Drive
      </button>
      <img className='google-img' src={google_drive}></img>
    </div>
  );
};
