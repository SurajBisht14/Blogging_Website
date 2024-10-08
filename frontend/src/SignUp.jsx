import React, { useRef, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from './App.jsx';
import loaderImg from './images/loader.svg';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const { authState, setAuthState } = useContext(MyContext)

  const [loadingPage, setLoadingPage] = useState(false);
  const passRef1 = useRef(null);
  const passRef2 = useRef(null);
  let [ErrorMsg, setErrorMsg] = useState("");
  let [successMsg, setsuccessMsg] = useState("")


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      passRef1.current.style.border = `2px solid red`;
      passRef2.current.style.border = `2px solid red`;
    } else {
      passRef1.current.style.border = `2px solid transparent`;
      passRef2.current.style.border = `2px solid transparent`;

      setLoadingPage(true);       //showing load page

      try {
        const response = await fetch(`${backendUrl}/signup`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          credentials : 'include',
          body: JSON.stringify(formData)
        });

        setLoadingPage(false);  //closing load page
        const data = await response.json();

        if (response.ok) {
          setsuccessMsg(data.msg);
          setTimeout(() => {
            setsuccessMsg("");
            if (!authState.isAuth) {
              navigate('/login')
            }

          }, 1000);
          setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
          })
        }
        else {
          setErrorMsg(data.error);
          setTimeout(() => {
            setErrorMsg("")
          }, 5000);
        }
      }
      catch (error) {
        console.error('Error during signup:', error);
      }
    }
  };

  return (
    <div className="h-[87vh]  flex items-center justify-center relative overflow-hidden">

      {ErrorMsg.length > 0 &&

        <p className="text-sm  bg-red-200 py-2 w-full text-red-600 fixed  top-[13vh] z-50 text-center">{ErrorMsg} <span className='absolute right:0 pd-1 md:right-4 text-red-600 hover:cursor-pointer text-[20px] font-extrabold' onClick={() => { setErrorMsg("") }}>&#10005;</span></p>

      }

      {successMsg.length > 0 &&

        <p className="text-sm  bg-green-200 py-2 w-full text-green-600 fixed  top-[13vh] z-50 text-center">{successMsg} <span className='absolute  right-4 text-green-600 hover:cursor-pointer text-[20px] font-extrabold' onClick={() => { setsuccessMsg("") }}>&#10005;</span></p>

      }

      <div className="bg-white px-8 pt-1 rounded-xl  h-[95%]  w-[90%] sm:w-full max-w-md relative  shadow-[-1px_-1px_10px_rgba(0,0,0,.1),1px_1px_10px_rgba(0,0,0,.1)]">
        {loadingPage && (
          <div className='absolute top-0 left-0 h-full w-full z-50 flex items-center justify-center rounded-xl'>
            <img src={loaderImg} alt='loading' className='w-[90px]' />
          </div>
        )}
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full   py-2 lg:py-3 px-3 text-gray-700  focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 lg:py-3  px-3 text-gray-700  focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Create Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 lg:py-3  px-3 text-gray-700  focus:outline-none focus:shadow-outline"
              required
              ref={passRef1}
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="shadow z-50 appearance-none border rounded-lg w-full py-2 lg:py-3  px-3 text-gray-700 mb-3  focus:outline-none focus:shadow-outline"
              required
              ref={passRef2}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-gradient-to-r from-[rgba(0,0,0,1)] to-[rgba(0,0,0,.5)] text-white font-bold py-2 lg:py-3 w-full rounded-lg focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className='absolute right-10 bottom-2 cursor-pointer text-[rgba(0,0,0,.6)] font-bold'>
          <Link to='/login'>Already a user?</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;

