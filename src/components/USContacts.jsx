import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalComponent from "./DetailsModal";

const USContacts = () => {
  // State to manage the visibility of modals
  const [usData, setUsData] = useState([]);

  const [usFilteredData, setUsFilteredData] = useState([]);

  const [usSearchedData, setUsSearchedData] = useState([]);

  const [usSearchTerm, setUsSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);

  const [showUSContactsModal, setShowUSContactsModal] = useState(true);
  const [detailsModal, setDetailsModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const [uspage, setUsPage] = useState(1);

  const [usTotalData, setUsTotalData] = useState(0);

  const [usTotalPage, setUsTotalPage] = useState(0);

  const [usOnlyEvenContacts, setUsOnlyEvenContacts] = useState(false);

  const navigate = useNavigate();

  const usMountComp = useRef(0);
  const scrollRef = useRef(450);

  // US contact
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://contact.mediusware.com/api/country-contacts/United%20States/?page=${uspage}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "X-CSRFToken":
                "wb7n1TfuiJOG1xHKF41NW9G4gBFYtSRKgL7ZbL20IavalozMp9IggCMyFY31sfDS",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const newData = data.results;
          if (uspage === 1) {
            setUsData(newData);
            setUsFilteredData(newData);
            setUsTotalData(data.count);
            setUsTotalPage(Math.ceil(data.count / newData.length));
          } else {
            usMountComp.current = 1;
            setUsData((prevData) => [...prevData, ...newData]);
            setUsFilteredData((prevData) => [...prevData, ...newData]);
          }

          if (usOnlyEvenContacts) {
            setUsFilteredData((recentData) => {
              const evenData = recentData.filter((item) => {
                if (parseInt(item.phone[item.phone.length - 1]) % 2 === 0) {
                  return item;
                } else {
                  return;
                }
              });
              return evenData;
            });
          }
        } else {
          // Handle error scenarios, e.g., log or display an error message
          console.error(
            "Error fetching data:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uspage]);

  useEffect(() => {
    if (usOnlyEvenContacts) {
      const evenData = usData.filter((item) => {
        if (parseInt(item.phone[item.phone.length - 1]) % 2 === 0) {
          return item;
        } else {
          return;
        }
      });
      setUsFilteredData(evenData);
    } else {
      setUsFilteredData([...usData]);
    }
  }, [usOnlyEvenContacts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://contact.mediusware.com/api/country-contacts/United%20States/?search=${usSearchTerm}&page_size=${usTotalData}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "X-CSRFToken":
                "wb7n1TfuiJOG1xHKF41NW9G4gBFYtSRKgL7ZbL20IavalozMp9IggCMyFY31sfDS",
            },
          }
        );
        if (response.ok) {
          const searchedData = await response.json();
          const newData = searchedData.results;
          if (usSearchTerm.length > 0) {
            setUsSearchedData(newData);
          } else {
            setUsSearchedData([]);
          }
        } else {
          // Handle error scenarios, e.g., log or display an error message
          console.error(
            "Error fetching data:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [usSearchTerm]);

  console.log("Us DATA", usData);
  console.log("Us Filtered DATA", usFilteredData);
  console.log("Us Searched DATA", usSearchedData);
  console.log(usOnlyEvenContacts);
  console.log(usSearchTerm);
  console.log(usTotalData);
  console.log(usTotalPage);

  // Scroll listener function
  const usHandleScroll = (event) => {
    const target = event.target;
    const threshold = 50;
    console.log("--------------------------------------");
    console.log("Scroll height", target.scrollHeight);
    console.log("Scroll Top", target.scrollTop);
    console.log("clientHeight", target.clientHeight);
    console.log("After minus", target.scrollHeight - target.scrollTop);
    console.log("ref", scrollRef.current);
    console.log("--------------------------------------");
    // Check if the user has reached the bottom of the modal
    if (
      target.scrollHeight - target.scrollTop <=
      target.clientHeight + threshold
    ) {
      console.log(`User reached the bottom of the modal.`);
      // Implement additional logic if needed
      console.log("Total Page", usTotalPage);
      if (uspage < usTotalPage) {
        setUsPage(uspage + 1);
        scrollRef.current = scrollRef.current + 450;
      }
    }
  };

  const handleShow = () => setDetailsModal(true);
  const handleClose = () => setDetailsModal(false);

  const handleButtonClick = (item) => {
    // Set the data you want to display in the modal
    setModalData(item);
    handleShow();
  };

  return (
    <div className="container">
      {/* US Contacts Modal */}
      <div
        className={`modal fade ${showUSContactsModal ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{
          display: showUSContactsModal ? "block" : "none",
        }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">US Contacts</h5>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{
                  width: "160px",
                }}
              >
                <input
                  value={usOnlyEvenContacts}
                  onChange={() => setUsOnlyEvenContacts(!usOnlyEvenContacts)}
                  type="checkbox"
                  name="even"
                  id="even"
                />
                <h6 className="mt-1">Even numbers only</h6>
              </div>
            </div>
            <div className=" modal-header d-flex justify-content-center">
              <input
                className="px-2 rounded-1"
                type="text"
                name="search"
                id="search"
                value={usSearchTerm}
                onChange={(e) => setUsSearchTerm(e.target.value)}
                placeholder="search"
              />
            </div>
            <div
              onScroll={usHandleScroll}
              className="modal-body"
              style={{ height: "350px" }}
            >
              {/* Modal content for All Contacts goes here */}
              {usSearchTerm.length > 0 ? (
                usSearchedData.length !== 0 ? (
                  usSearchedData.map((item, i) => (
                    <ul key={i}>
                      <li
                        style={{ cursor: "pointer" }}
                        onClick={() => handleButtonClick(item)}
                      >
                        {item.phone}
                      </li>
                    </ul>
                  ))
                ) : (
                  <>
                    {loading || <span className="mt-5">No Data Matched !</span>}
                  </>
                )
              ) : (
                usFilteredData.map((item, i) => (
                  <ul key={i}>
                    <li
                      style={{ cursor: "pointer" }}
                      onClick={() => handleButtonClick(item)}
                    >
                      {item.phone}
                    </li>
                  </ul>
                ))
              )}
              {/* {filteredData.map((item, i) => (
                <ul key={i}>
                  <li>{item.phone}</li>
                </ul>
              ))} */}

              {loading && <p className="my-4">loading...</p>}
            </div>
            <div className="modal-footer">
              {/* Add additional buttons here as needed */}
              <button
                onClick={() => {
                  setShowUSContactsModal(false);
                  navigate("/problem-2/all-contacts");
                }}
                type="button"
                className="btn"
                style={{ backgroundColor: "#46139f", color: "#ffffff" }}
              >
                All Contacts
              </button>
              <button
                type="button"
                className="btn"
                style={{ backgroundColor: "#ff7f50", color: "#ffffff" }}
              >
                US Contacts
              </button>
              <button
                type="button"
                className="btn rounded-1"
                style={{ border: "1px solid #46139f" }}
                onClick={() => {
                  setShowUSContactsModal(false);
                  navigate("/problem-2");
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Details Modal */}
      <ModalComponent
        showModal={detailsModal}
        handleClose={handleClose}
        modalData={modalData}
      />
    </div>
  );
};

export default USContacts;
