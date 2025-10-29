import React from "react";
import "../TutorialClient/TutorialClient.css";
import reqP from "../../assets/images/requests-pres.png";
import mapP from "../../assets/images/map-pres.png";
import signupPres from "../../assets/images/signup-pres.png";
const TutorialPrestataire = () => {
  const steps = [
    {
      title: "1. Créez votre profil professionnel",
      desc: "Complétez votre compte prestataire avec vos compétences et votre localisation pour apparaître sur la carte.",
      img: signupPres,
    },
    {
      title: "2. Consultez les demandes sur la carte",
      desc: "Accédez à la carte interactive pour voir les clients proches de vous et leurs besoins.",
      img: mapP,
    },
    {
      title: "3. Acceptez et gérez vos missions",
      desc: "Acceptez les demandes, communiquez avec le client et marquez le service comme complété une fois terminé.",
      img: reqP,
    },
  ];

  return (
    <div className="tutorial-page">
      <section className="tutorial-header">
        <h1>Guide Prestataire</h1>
        <p>Apprenez à offrir vos services efficacement avec <strong>ManuFind</strong>.</p>
      </section>

      {steps.map((step, index) => (
        <section
          key={index}
          className={`tutorial-step ${index % 2 === 0 ? "" : "reverse"}`}
        >
          <img src={step.img} alt={step.title} />
          <div className="text">
            <h2>{step.title}</h2>
            <p>{step.desc}</p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default TutorialPrestataire;
