import React, { useState } from 'react';
import './home.css';
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";

function Banner() {
  const slides = [
    {
      author: "George R.R. Martin",
      proverb: "“A reader lives a thousand lives before he dies...The man who never reads lives only one.”"
    },
    {
      author: "Groucho Marx",
      proverb: "“I find television very educating. Every time somebody turns on the set, I go into the other room and read a book.”"
    },
    {
      author: "C.S. Lewis",
      proverb: "“You can never get a cup of tea large enough or a book long enough to suit me.”"
    },
    {
      author: "Harper Lee ",
      proverb: "“Until I feared I would lose it, I never loved to read. One does not love breathing.”"
    }
  ]

  const [slide, setSlide] = useState(0);

  const nextSlide = () => {
    setSlide(slide === slides.length - 1 ? 0 : slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide === 0 ? slides.length - 1 : slide - 1);
  };

  return (
    <div className='banner'>
      <IoIosArrowDropleftCircle 
        className="arrow arrow-left" 
        onClick={prevSlide}
      />
      {
        slides.map((el, key) => (
          <div className={slide === key ? "slide" : "slide slide-hidden"} key={key}>
            <h1 className="proverb">{el.proverb}</h1>
            <p className="author">{el.author}</p>
          </div>
        ))
      }
      <IoIosArrowDroprightCircle
        className="arrow arrow-right"
        onClick={nextSlide}
      />
      <span className="indicators">
        {slides.map((_, idx) => {
          return (
            <button
              key={idx}
              className={
                slide === idx ? "indicator" : "indicator indicator-inactive"
              }
              onClick={() => setSlide(idx)}
            ></button>
          );
        })}
      </span>
    </div>
  )
}

export default Banner