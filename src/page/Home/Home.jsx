import React, { useState, useEffect } from "react";
import "../../styles/home.css";
import TopBar from "../../components/Topbar/TopBar";
import { SliderHome } from "../../components/Home/Slider/Slider";
import Service from "../../components/Home/Service/Service";
import Pricing from "../../components/Home/Pricing/Pricing";
import Footer from "../../components/Footer/Footer";
import Telephone from "../../components/Appointment/Telephone";
import ReactPlayer from "react-player";
import Scroll from "../../components/ScrollToTop/Scroll";
import axios from "axios";

export default function Home() {
  const [service, setService] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:8800/api/service/limit4");
      setService(res.data.value);
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <section className="section1">
        <div className="background-image">
          <div className="container-item">
            <TopBar />
            <div className="slider">
              <SliderHome />
            </div>
          </div>
        </div>
      </section>
      <div className="about-container">
        <div className="div-image">
          <img
            src="https://cdn.jamja.vn/blog/wp-content/uploads/2019/02/dong-tay-barbershop-1.jpg"
            alt=""
            className="image-about"
          />
        </div>
        <div className="text-about">
          <div className="text-about-mb">
            <span className="subheading"> About barber</span>
            <h2 className="h2-about">
              A SMOOTH BARBER EXPERIENCE IN YOUR TOWN
            </h2>
            <p>
              "Welcome to our convenient haircut booking system! Easily choose and book with quality hairdressers and locations. Enjoy a unique experience, save time and always ensure We guarantee you will have professional hair care services tailored to your personal needs. Experience it now to have beautiful and a comfortable beauty session!"
            </p>
          </div>
        </div>
      </div>
      <section className="section-2">
        <div className="service-container ">
          {service.map((value, index) => (
            <>
              <Service
                title={value.Name_Service}
                p={value.Description}
                image={value.Image}
              />
            </>
          ))}
        </div>
      </section>

      <div className="pricing-container">
        <span className="subheading"> pricing</span>
        <h2 className="h2-about"> PRICE & PLANS</h2>
        <div className="pricing-item">
          <Pricing />
        </div>
      </div>
      <div className="telephone">
        <Telephone />
      </div>
      <Scroll />
      
      <Footer />
    </div>
  );
}
