import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/blog.css';
import loaderImg from './images/loader.svg';
import laptopImg from './images/laptop.jpg';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


function Home() {
  let slider = useRef(null);
  let [selectedBlogName, setSelectedBlogName] = useState(() => {
    const storedBlogName = localStorage.getItem('selectedBlogName');
    return storedBlogName || 'All'; 
  });



  let [categorizedBlogsArray, setCategorizedBlogsArray] = useState([]);
  let [loadingPage, setLoadingPage] = useState(true);
  let [searchValueHolder, setSearchValueHolder] = useState("");
  let [categoriesArray, setCategoriesArray] = useState([]);
  let [phoneCategoriesArray, setPhoneCategoriesArray] = useState([]);
  let [dropDownValue, setDrop] = useState(false);
  let [errorMsg, setErrorMsg] = useState("");
  let [ErrorMsg2, setErrorMsg2] = useState("");


  useEffect(() => {
    mainBlogFunction(selectedBlogName);
  }, [selectedBlogName]);

  // Update slider effect
  useEffect(() => {
    if (slider.current && document.querySelector(`[data-name="${selectedBlogName}"]`)) {
      slider.current.style.setProperty("--sliderWidthValue", `${document.querySelector(`[data-name="${selectedBlogName}"]`).offsetWidth - 20}px`);
      slider.current.style.setProperty("--sliderLeftValue", `${document.querySelector(`[data-name="${selectedBlogName}"]`).offsetLeft + 10}px`);
    }
  }, [categorizedBlogsArray, selectedBlogName]);

  // Function to handle blog name selection
  function gettingBlogNameFunction(e) {
    const blogName = e.target.dataset.name;
    setSelectedBlogName(blogName);
  }

  //making description small

  function descriptionSmall(text) {

    let arrayText = text.split(" ");
    let finalAnswer = arrayText.slice(0, 10).join(" ");
    return (finalAnswer)
  }
  function ContentSmall(text){
    
    let arrayText = text.split(" ");
    let finalAnswer = arrayText.slice(20 , 30).join(" ");
    return (finalAnswer)
  }


  // Function to fetch blog data
  const mainBlogFunction = async function (blogName) {
    try {
      setLoadingPage(true);
      let blogData = await fetch(`${backendUrl}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials:"include",
        body: JSON.stringify({ blogName })
      });
      let data = await blogData.json();

      if (!blogData.ok) {
        setLoadingPage(false);
        setErrorMsg(data.msg);
        setTimeout(()=>{setErrorMsg("")},5000)
        setSearchValueHolder("");
        setSelectedBlogName("All");
        throw new Error(`HTTP error! Status: ${blogData.status}`);
      }

      setSearchValueHolder("");
      setLoadingPage(false);

      let myNameofCategory = data.name
        .slice()
        .map((e, index) => (
          <div
            className="cursor-pointer px-4 py-2 text-base font-semibold mx-auto leading-normal  text-gray-700"
            key={index}
            onClick={gettingBlogNameFunction}
            data-name={e.name}
          >
            {e.name}
          </div>
        ));

      let myNameofCategoryPhone = data.name
        .slice()
        .map((e, index) => (
          <div key={index} className='pl-2 font-serif text-[20px] text-white hover:cursor-pointer' onClick={gettingBlogNameFunction} data-name={e.name}>{e.name}</div>
        ));

      let finalArticleData = data.articles.map((e, i) => (
        <Link
          to='/blogInfo'
          key={i}
          state={{ article: e }}
        >
          <div key={e._id} className="hover:cursor-pointer border-3 border-black  sm:border-0 rounded-lg  hover:scale-[1.02]  transition-all shadow-lg relative md:h-[500px]">
            <img src={e.urlToImage} className="aspect-video w-full rounded-md" alt="" />
            <div className="min-h-min p-3 ">
              <p className="mt-4 w-full text-xs font-semibold leading-tight text-gray-700">
                #{e.category_name}
              </p>
              <div className=''>
                <p className="mt-4 flex-1 text-base font-semibold text-gray-900">{e.title}</p>
                <p className="mt-4 w-full text-sm leading-normal text-gray-600">
                  {descriptionSmall(e.description) + ". " + ContentSmall(e.content)+'...'}
                  <span className="font-semibold">Read more</span>
                </p>
              </div>

              <div className="flex space-x-3 mt-6">
                <div className='md:absolute md:bottom-2 '>
                  <p className="text-sm font-semibold leading-tight text-gray-900 ">
                    Author : {e.author}
                  </p>
                  <p className="text-sm leading-tight text-gray-600">Posted On : {e.publishedAt.slice(0, 10)}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ));

      setCategorizedBlogsArray(finalArticleData);
      setCategoriesArray(myNameofCategory);
      setPhoneCategoriesArray(myNameofCategoryPhone);
    }
     catch (error) {
      console.log(error)
      if(error.status==='500'){
        setErrorMsg2("Server down try again later");
      }
     
    }
  }

  function searchButtonClicked(nameOfBlog) {
    if (nameOfBlog) {
      let splitName = nameOfBlog.split('')
      let finalAnswer = splitName[0].toUpperCase() + splitName.slice(1).join("").toLowerCase();
      setSelectedBlogName(finalAnswer);
    }
  }

  function searchOnchangefunc(e) {
    setSearchValueHolder(e.target.value);
  }

  function dropDown() {
    setDrop(!dropDownValue);
  }

  useEffect(() => {
    localStorage.setItem('selectedBlogName', selectedBlogName);
  }, [selectedBlogName]);

  return (
    <>
      <div className="h-[87vh] w-full relative overflow-y-scroll">
      {
      ErrorMsg2 && <div className='absolute transition-all top-[0] bg-red-200 text-red-600 z-[80] border-2 border-red-600 w-full  font-bold h-[5%] p-5 flex items-center justify-center font-serif md:text-[25px]'>
        {ErrorMsg2}
        <span className='font-bold text-red-600 absolute right-6 hover:cursor-pointer' onClick={()=>{setErrorMsg2("")}}>&#10005;</span>
      </div>
      }
        {loadingPage && (
          <div className='fixed h-screen w-screen top-0 left-0 z-50 flex items-center justify-center rounded-xl'>
            <img src={loaderImg} className='fixed w-[80px]' alt='loading' />
          </div>
        )}

    { errorMsg.length> 0 &&

          <p className="text-sm  bg-red-200 py-2 w-full text-red-600 fixed  top-[13vh] z-50 text-center">{errorMsg} <span className='absolute right-4 text-red-600 hover:cursor-pointer text-[20px] font-extrabold' onClick={()=>{setErrorMsg("")}}>&#10005;</span></p>
        
    }
        <div className="items-center flex justify-center">
          <div id='image'>
            <p className='text-white font-bold font-serif text-center text-[18px] sm:text-[30px]'>"Tell the world about yourself"</p>
            <p className='text-white font-bold font-serif text-center text-[18px] sm:text-[30px]'>Start your journey</p>
            <div className='text-center w-full'>
            <Link to='/createBlogs'> <button className='bg-white p-3 px-16 text-[20px] rounded-lg font-serif hover:scale-[1.1] transition-all ease-in-out'>
                Create Blogs
              </button>
              </Link>  
            </div>
            <img src={laptopImg} className="absolute top-0 object-cover h-full w-full z-[-1]" />
          </div>
        </div>

        <div>
          <div className="mx-auto max-w-7xl px-2">
            <div className="flex flex-col space-y-0 pb-10 pt-10">
              <div className="mx-auto mb-14 max-w-2xl text-center">
                <span className="mb-4 inline-block rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-black">
                  OUR BLOG
                </span>
                <h1 className="text-5xl font-bold">Latest news from our blog</h1>
              </div>
              <div className="mt-5 mx-auto flex w-full items-center space-x-2 md:w-1/2">
                <input
                  className="flex h-14 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  placeholder="Search Topics eg. Tech , Sports "
                  value={searchValueHolder}
                  onChange={searchOnchangefunc}
                />
                <button
                  type="button"
                  className="rounded-md bg-black px-3 py-4 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  onClick={() => searchButtonClicked(searchValueHolder)}
                >
                  Search
                </button>
              </div>
            </div>

          {/* show dropdown if categories lenght is increase  */}

           { 
           categoriesArray.length <= 10 ?
            <div className="mt-2 hidden w-full flex-col justify-between space-y-4 md:flex md:flex-row">
              <div id="slider" ref={slider}>
                {categoriesArray.map((e) => e)}
              </div>
            </div>
            :
            <div className='md:w-1/2 mx-auto h-14 relative rounded-lg text-white text-[20px] font-serif  hidden md:flex  items-center justify-between bg-[rgba(0,0,0,1)]' onClick={dropDown}>
            <span className='pl-2 text-[20px] sm:text-[25px]'>
              {selectedBlogName}
            </span>
            <span className='flex h-full items-center pr-3 cursor-pointer'>
              {!dropDownValue ? <i className="fa-solid fa-sort-up pt-2"></i> : <i className="fa-solid fa-sort-down pb-3"></i>}
            </span>

            {dropDownValue && (
              <div className='transition-all absolute border-t-2 border-t-white w-full flex flex-col justify-around z-40 rounded-b-lg top-[85%] bg-[rgba(0,0,0,1)]'>
                {phoneCategoriesArray.map((e) => e)}
              </div>
            )}
          </div>
          }

            <div className='w-full  h-14 relative rounded-lg text-white text-[20px] font-serif flex md:hidden items-center justify-between bg-[rgba(0,0,0,1)]' onClick={dropDown}>
              <span className='pl-2 text-[20px] sm:text-[25px]'>
                {selectedBlogName}
              </span>
              <span className='flex h-full items-center pr-3'>
                {!dropDownValue ? <i className="fa-solid fa-sort-up pt-2"></i> : <i className="fa-solid fa-sort-down pb-3"></i>}
              </span>

              {dropDownValue && (
                <div className='lg:hidden transition-all absolute border-t-2 border-t-white w-full  flex flex-col justify-around z-40 rounded-b-lg top-[85%] bg-[rgba(0,0,0,1)]'>
                  {phoneCategoriesArray.map((e) => e)}
                </div>
              )}
            </div>

            <div className="grid gap-6 gap-y-10 py-6 md:grid-cols-2 lg:grid-cols-3">
              {categorizedBlogsArray.map((e) => e)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;



