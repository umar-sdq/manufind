import React from "react";
import "./TutorialClient.css";
import signupClient from "../../assets/images/signup-client.png";
import newDemande from "../../assets/images/demande-new.png";
import reqCl from "../../assets/images/requests-client.png";


const TutorialClient = () => {
  const steps = [
    {
      title: "1. Créez votre compte client",
      desc: "Inscrivez-vous sur ManuFind en quelques secondes pour accéder à tous les services près de chez vous.",
      img: signupClient,
    },
    {
      title: "2. Publiez une demande",
      desc: "Décrivez votre besoin, ajoutez une adresse et choisissez la catégorie. Un professionnel vous répondra rapidement.",
      img: newDemande,
    },
    {
      title: "3. Suivez vos demandes",
      desc: "Depuis votre profil, consultez l’état de vos demandes et communiquez avec les prestataires.",
      img: reqCl,
    },
  ];

  return (
    <div className="tutorial-page">
      <section className="tutorial-header">
        <h1>Guide Client</h1>
        <p>Découvrez comment demander un service facilement sur <strong>ManuFind</strong>.</p>
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

export default TutorialClient;
