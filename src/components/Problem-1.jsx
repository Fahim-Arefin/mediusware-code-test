import React, { useEffect, useState } from "react";

const Problem1 = () => {
  const [show, setShow] = useState("all");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, status);
    setData([
      ...data,
      {
        name,
        status,
      },
    ]);
  };

  useEffect(() => {
    if (show === "all") {
      const activeData = data.filter(
        (item) => item.status.toLowerCase() === "active"
      );
      const completedData = data.filter(
        (item) => item.status.toLowerCase() === "completed"
      );
      const restOfTheData = data.filter((item) => {
        if (
          item.status.toLowerCase() === "active" ||
          item.status.toLowerCase() === "completed"
        ) {
          return;
        } else {
          return item;
        }
      });
      console.log(activeData);
      console.log(completedData);
      console.log(restOfTheData);
      const orderedData = [...activeData, ...completedData, ...restOfTheData];
      setFilteredData([...orderedData]);
    }
    if (show === "active") {
      setFilteredData(
        data.filter((item) => item.status.toLowerCase() === "active")
      );
    }
    if (show === "completed") {
      setFilteredData(
        data.filter((item) => item.status.toLowerCase() === "completed")
      );
    }
  }, [data, show]);

  const handleClick = (val) => {
    setShow(val);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-1</h4>
        <div className="col-6 ">
          <form
            onSubmit={handleSubmit}
            className="row gy-2 gx-3 align-items-center mb-4"
          >
            <div className="col-auto">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Name"
                required
              />
            </div>
            <div className="col-auto">
              <input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Status"
                required
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="col-8">
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${show === "all" && "active"}`}
                type="button"
                onClick={() => handleClick("all")}
              >
                All
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${show === "active" && "active"}`}
                type="button"
                onClick={() => handleClick("active")}
              >
                Active
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${show === "completed" && "active"}`}
                type="button"
                onClick={() => handleClick("completed")}
              >
                Completed
              </button>
            </li>
          </ul>
          <div className="tab-content"></div>
          <table className="table table-striped ">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Problem1;
