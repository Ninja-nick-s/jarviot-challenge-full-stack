import React from "react";

export const Files = (props) => {
  return (
    <div className="table-component">
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>size</th>
            <th>File Extension</th>
            <th>Owner Email</th>
          </tr>
        </thead>
        <tbody>
          {props.data?.map((file, i) => (
            <tr key={i}>
              <td>
                <a href={file.viewLink}>{file.name}</a>
              </td>
              <td>{file.size ? file.size + " kb" : "NA"}</td>
              <td>{file.fileExtension ? file.fileExtension : "NA"}</td>
              <td className='table-owner'>
                <div>{file.ownerEmail}</div>
                <img src={file.ownerPhoto}></img>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
