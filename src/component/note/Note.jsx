import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
  update,
} from "firebase/database";
import { faL } from "@fortawesome/free-solid-svg-icons";

const Note = () => {
  const notify = () =>
    toast.success("Added!", {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [check, setCheck] = useState(false);
  let [emailError, setEmailError] = useState("");
  let [passwordError, setpasswordError] = useState("");
  let [passwordShow, setPasswordShow] = useState(false);
  let [alltodouser, setAllTodouser] = useState([]);
  let [alltodopass, setAllTodopass] = useState([]);
  let [editModal, setEditModal] = useState(false);
  let [addlist, setAddList] = useState(false);
  let [updateemail, setUpdateEmail] = useState("");
  let [updateepass, setUpdatePass] = useState("");
  let [id, setId] = useState("");

  function handleEmail(ev) {
    setEmail(ev.target.value);
    setEmailError("");
  }

  function handlePassword(pv) {
    setPassword(pv.target.value);
    setpasswordError("");
  }

  function handleCheckbox(cv) {
    setCheck(cv.target.checked);
  }

  let handleSubmit = (b) => {
    b.preventDefault();
    if (email == "") {
      setEmailError("Email is required");
    } else {
      const db = getDatabase();
      set(push(ref(db, "user/")), {
        emailaddress: email,
      }).then(() => {
        setEmail("");
      });
    }

    if (password == "") {
      setpasswordError("Password is required");
    } else {
      const db = getDatabase();
      set(push(ref(db, "pass/")), {
        accoutpassword: password,
      }).then(() => {
        setPassword("");
      });
    }

    if ((email, password)) {
      notify();
    }
    setAddList(false);
  };

  useEffect(() => {
    const db = getDatabase();
    const todoRef = ref(db, "user/");
    onValue(todoRef, (snapshot) => {
      let array = [];
      snapshot.forEach((items) => {
        array.push({ value: items.val(), id: items.key });
        setAllTodouser(array);
      });
    });
  }, []);
  useEffect(() => {
    const db = getDatabase();
    const todoRef = ref(db, "pass/");
    onValue(todoRef, (snapshot) => {
      let array = [];
      snapshot.forEach((items) => {
        array.push({ value: items.val(), id: items.key });
        setAllTodopass(array);
      });
    });
  }, []);

  let handleAddList = (item) => {
    setAddList(true);
    setId(item.id)
  };
  let handleDelete = (id) => {
    const db = getDatabase();
    remove(ref(db, "user/" + id));
    remove(ref(db, "pass/" + id));
  };
  let handleEdit = (item) => {
    setEditModal(true);
  };

  let handleUpdateEmail = (eu) => {
    setUpdateEmail(eu.target.value);
  };
  let handleUpdatePass = (pu) => {
    setUpdatePass(pu.target.value);
  };

  let handleUpdate = (eu) => {
    const db = getDatabase();
    update(ref(db, "user/" + id), {
      emailaddress: updateemail,
    });
  };

  return (
    <>
      {addlist && (
        <div className="max-w-sm mx-auto absolute top-[80px] right-[310px] bg-black px-[20px] py-[30px] rounded-[15px]">
          <ToastContainer
            position="bottom-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              value={email}
              onChange={handleEmail}
              type="email"
              id="email"
              className="text-sm rounded-lg block w-full p-2.5 focus:ring-[#fff] border-[1px] border-gray-500 bg-transparent text-white hover:border-[#f44] transition duration-300 ease-in-out"
              placeholder="Enter Email"
              required=""
            />
            {emailError && (
              <h2 className="text-[12px] text-red-500 ml-[2px]  ">
                {emailError}
              </h2>
            )}
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={handlePassword}
                type={passwordShow ? "text" : "password"}
                placeholder="Enter password"
                id="password"
                className="text-sm rounded-lg block w-full p-2.5 focus:ring-[#fff] border-[1px] border-gray-500 bg-transparent text-white hover:border-[#f44] transition duration-300 ease-in-out"
                required=""
              />
              {passwordShow ? (
                <FaEye
                  onClick={() => setPasswordShow(false)}
                  className=" absolute top-[14px] right-3 text-[#fff]"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setPasswordShow(true)}
                  className=" absolute top-[14px] right-3 text-[#fff]"
                />
              )}
            </div>

            {passwordError && (
              <h2 className="text-[12px] text-red-500 ml-[2px]  ">
                {passwordError}
              </h2>
            )}
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="text-[#000000] bg-[#fff] px-[15px] py-[5px] border-[2px] border-[#000000] rounded-[10px] ml-[40px] hover:bg-transparent hover:text-[#fff] hover:border-[#fff] transition duration-300 ease-out  "
          >
            Submit
          </button>
        </div>
      )}

      <div className="note_main h-[100vh] w[100%] ">
        <div className="note_nav bg-gray-500 flex items-center justify-evenly ">
          <div className="note_title px-[35px] py-[20px] text-[20px] font-[600] tracking-[2px] ">
            Accounts list
          </div>
          <h3 className=" pointer-events-none text-[15px] font-[400] ">
            list everything here
          </h3>
          <button
            onClick={handleAddList}
            className="px-[10px] py-[10px] bg-[#000000] text-[#f2ebe3] font-[600] border-[2px] border-[#000000] rounded-[10px] leading-[10px]
           hover:border-[2px] hover:border-[#000000] hover:bg-transparent hover:text-[#000000] transition duration-300 ease-out "
          >
            Add account
          </button>
        </div>
        <div className="all_notes">
          <ul className="w-[70%] text-sm font-medium text-gray-900 bg-transparent mt-[20 px] relative">
            {alltodouser.map((items) => (
              <li className="w-full py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600 flex justify-between px-[25px]">
                {items.value.emailaddress}
                <div className="all_btns">
                  <button
                    onClick={() => handleDelete(items.id)}
                    type="submit"
                    className="text-[#fff] bg-[#000000] px-[5px] py-[1px] border-[2px] border-[#000000] rounded-[10px] 
                  ml-[40px] hover:bg-transparent hover:text-[#000000] hover:border-[#000000] transition duration-300 ease-out   "
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(items)}
                    type="submit"
                    className="text-[#fff] bg-[#000000] px-[5px] py-[1px] border-[2px] border-[#000000] rounded-[10px] 
                  ml-[40px] hover:bg-transparent hover:text-[#000000] hover:border-[#000000] transition duration-300 ease-out   "
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
            {alltodopass.map((items) => (
              <li className="w-full py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600 flex justify-between px-[25px]">
                {items.value.accoutpassword}
                <div className="all_btns">
                  <button
                    onClick={() => handleDelete(items.id)}
                    type="submit"
                    className="text-[#fff] bg-[#000000] px-[5px] py-[1px] border-[2px] border-[#000000] rounded-[10px] 
                  ml-[40px] hover:bg-transparent hover:text-[#000000] hover:border-[#000000] transition duration-300 ease-out  "
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(items)}
                    type="submit"
                    className="text-[#fff] bg-[#000000] px-[5px] py-[1px] border-[2px] border-[#000000] rounded-[10px] 
                  ml-[40px] hover:bg-transparent hover:text-[#000000] hover:border-[#000000] transition duration-300 ease-out  "
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
            {editModal && (
              <div className="w-[220px] mx-auto absolute top-[10px] right-[-260px] bg-black px-[20px] py-[30px] rounded-[15px] text-center ">
                <input
                  onChange={handleUpdateEmail}
                  type="email"
                  id="email"
                  className="text-sm rounded-lg block w-full p-2.5 focus:ring-[#fff] border-[1px] border-gray-500 bg-transparent mb-[50px] text-white hover:border-[#f44] transition duration-300 ease-in-out"
                  placeholder="Enter Email"
                  required=""
                />
                <input
                  onChange={handleUpdatePass}
                  type={passwordShow ? "text" : "password"}
                  placeholder="Enter password"
                  id="password"
                  className="text-sm rounded-lg block w-full p-2.5 focus:ring-[#fff] border-[1px] mb-[30px] border-gray-500 bg-transparent text-white hover:border-[#f44] transition duration-300 ease-in-out"
                  required=""
                />
                <div className="edit_btns flex justify-evenly items-center">
                  <button
                    onClick={handleUpdate}
                    type="submit"
                    className="text-[#000000] bg-[#fff] px-[15px] py-[5px] border-[2px] border-[#000000] rounded-[10px] hover:bg-transparent hover:text-[#fff] hover:border-[#fff] transition duration-300 ease-out  "
                  >
                    Update
                  </button>
                  <button
                    onClick={() => [setEditModal(false)]}
                    type="submit"
                    className="text-[#000000] bg-[#fff] px-[15px] py-[5px] border-[2px] border-[#000000] rounded-[10px] hover:bg-transparent hover:text-[#fff] hover:border-[#fff] transition duration-300 ease-out  "
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Note;
