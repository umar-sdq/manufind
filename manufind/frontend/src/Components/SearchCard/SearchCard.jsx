import "./SearchCard.css"

const SearchCard = () => {
  return (
    <div className="search-card__panel">
      <p className="search-card__title">
        Trouvez des manufacturiers de confiance près de chez vous
      </p>
      <div className="search-card__form">
        <input type="text" placeholder="Que recherchez-vous ?" />
        <input type="text" placeholder="Code postal" />
        <button>🔍</button>
      </div>
    </div>
  )
}

export default SearchCard
