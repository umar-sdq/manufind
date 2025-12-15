import React from "react";
import "./About.css";
import imgClient from "../../assets/images/icon-client.png";
import mapBack from "../../assets/images/map-back.png";
import imgWorker from "../../assets/images/reno-pic.png";
import { NavLink } from "react-router-dom";
const About = () => {
  return (
    <div className="about-page">

      <section className="about-intro">
        <div className="about-card">
          <h2>Devenez un client</h2>
          <p>
            Publiez facilement une demande de service et trouvez un travailleur
            qualifié près de chez vous.
          </p>
            <NavLink to={"/signup"}>Créer un compte →</NavLink>
 
        </div>

        <div className="about-card">
          <h2>Devenez un travailleur</h2>
          <p>
            Acceptez des demandes selon vos compétences et votre horaire. Gagnez
            de nouveaux clients facilement.
          </p>
            <NavLink to={"/signup"}>Rejoindre Manufind →</NavLink>
        </div>

        <div className="about-card">
          <h2>Carte interactive</h2>
          <p>
            Visualisez toutes les demandes actives sur une carte et trouvez
            rapidement celles proches de vous.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div>
          <h2>Un service rapide et simple</h2>
          <p>
            Publiez votre demande, choisissez un professionnel et suivez
            l’avancement en temps réel. Plus besoin d’appels ni de recherches
            compliquées — tout se fait sur ManuFind.
          </p>
          <NavLink to={"/signup"} className="dec-btn">
                  Découvrir
                  </NavLink>
        </div>
        <img src={imgClient} alt="Travailleur" />
      </section>

      <section className="about-section">
        <img src={imgWorker} alt="Outils" />
        <div>
          <h2>Des professionnels de confiance</h2>
          <p>
            Chaque travailleur sur ManuFind est vérifié et évalué par les
            clients. Vous pouvez consulter les avis avant d’accepter un service.
          </p>
          <NavLink to={"/services"} className="dec-btn">
                  En savoir plus
                  </NavLink>
        </div>
      </section>

      <section className="about-mission">
        <h2>Notre mission</h2>
        <p>
          Offrir une plateforme simple, rapide et fiable qui connecte des gens à
          travers leurs besoins du quotidien — tout en soutenant les travailleurs
          locaux dans leur développement.
        </p>
      </section>
    </div>
  );
};

export default About;
