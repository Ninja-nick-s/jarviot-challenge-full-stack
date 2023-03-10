import React, { useEffect, useState } from "react";
import GoogleDrive from "../apis/GoogleDrive";
import { useNavigate } from "react-router-dom";
import { Files } from "../components/Files";

export const Reportpage = () => {
  const navigate = useNavigate();
  const [alldata, setAlldata] = useState(null);
  const [riskScore, setriskScore] = useState(0);
  const [sharedfilescount, setSharedfilecount] = useState(0);
  const [ownedsharedfilecount, setOwnedsharedfilecount] = useState(0);
  const [ownedfilecount, setOwnedfilecount] = useState(0);
  const getData = async () => {
    const data = await GoogleDrive.get("/files");
    setAlldata(data);
    let totalfiles = data.data.filescount;
    let sharedfilescount = data.data.sharedfilescount;
    let ownedsharedfilecount = data.data.ownedsharedfilecount;
    let ownedfilecount = totalfiles - (sharedfilescount + ownedsharedfilecount);
    let riskScore = parseInt(
      ((sharedfilescount + ownedsharedfilecount) * 100) / totalfiles
    );
    setriskScore(riskScore);
    setSharedfilecount(sharedfilescount);
    setOwnedsharedfilecount(ownedsharedfilecount);
    setOwnedfilecount(ownedfilecount);
  };

  const Revoke = async () => {
    await GoogleDrive.get("/revoke");
    navigate("/");
  };

  useEffect(() => {
    getData();
  }, []);
  async function AuthenticateStatus() {
    const res = await GoogleDrive.get("/auth");
    if (res.data.authed === false) {
      navigate("/");
    }
  }
  useEffect(() => {
    AuthenticateStatus();
  }, []);

  return (
    <div>
      <div className='report-title'>
        <h1>Google Drive Risk Report</h1>
        <button onClick={Revoke}>Revoke access</button>
      </div>
      <div className="report-analytics">
        <span>Risk score : {riskScore}</span>
        <span>Files completely Owned : {ownedfilecount}</span>

        <span>Files Owned and Shared : {ownedsharedfilecount}</span>

        <span>Files Shared With you : {sharedfilescount}</span>
      </div>
      <hr/>
      <div className="files-table">
        <h1>Self Owned Files Not Shared With Anyone</h1>
        <Files data={alldata?.data.selfownedfiles}></Files>
      </div>
      <hr/>
      <div className="files-table">
        <h1>Files Shared By You</h1>
        <Files data={alldata?.data.ownedsharedfiles}></Files>
      </div>
      <hr/>
      <div className="files-table">
        <h1>Files Shared With You</h1>
        <Files data={alldata?.data.sharedfiles}></Files>
      </div>
    </div>
  );
};
