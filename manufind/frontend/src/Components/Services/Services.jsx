import React from "react";
import "./Services.css";
import { NavLink } from "react-router-dom";
import renoImg from "../../assets/images/renoImg.jpg";
import movingImg from "../../assets/images/movingImg.png";
import electricianimg from "../../assets/images/electricianimg.jpg";

const Services = () => {
  return (
    <div className="services-page">
      <section className="services-intro">
        <h1>Nos Services</h1>
        <p>
          ManuFind offre plus de <span>20 catégories</span> de services pour
          répondre à tous vos besoins — et ce n’est qu’un début.
        </p>
      </section>

      <section className="service-section">
        <img src={electricianimg} alt="Plomberie et Électricité" />
        <div>
          <h2>Plomberie & Électricité</h2>
          <p>
            Des experts qualifiés à votre service pour toute réparation ou
            installation. Profitez d’un travail fiable, rapide et garanti.
          </p>
 <NavLink to={"/signup"} className="dec-btn">
        Découvrez plus
        </NavLink>        </div>
      </section>

      <section className="service-section">
        <div>
          <h2>Rénovation & Peinture</h2>
          <p>
            Rafraîchissez votre maison avec style. De la simple retouche à la
            rénovation complète, nos professionnels vous accompagnent.
          </p>
          <NavLink to={"/signup"} className="dec-btn">
        En savoir plus
        </NavLink>
        </div>
        <img src={renoImg} alt="Rénovation et Peinture" />
      </section>

      <section className="service-section">
        <img src={movingImg} alt="Nettoyage et Déménagement" />
        <div>
          <h2>Nettoyage & Déménagement</h2>
          <p>
            Simplifiez vos tâches quotidiennes grâce à des services rapides,
            organisés et efficaces. Reposez-vous, on s’occupe de tout.
          </p>
        </div>
      </section>

      <section className="services-cta">
        <h2>Et bien plus encore...</h2>
        <p>
          Informatique, maçonnerie, serrurerie, climatisation, petits travaux —
          plus de <span>20 catégories</span> vous attendent sur{" "}
          <strong>ManuFind</strong>.
        </p>
        <NavLink to={"/signup"} className="dec-btn">
        Inscrivez-vous
        </NavLink>
      </section>
    </div>
  );
};

export default Services;
